package com.pulsewatch.worker;

import com.pulsewatch.model.Heartbeat;
import com.pulsewatch.model.HttpMethod;
import com.pulsewatch.model.Monitor;
import com.pulsewatch.model.MonitorStatus;
import com.pulsewatch.repository.HeartbeatRepository;
import com.pulsewatch.repository.MonitorRepository;
import com.pulsewatch.service.IncidentService;
import com.pulsewatch.util.SsrfValidationException;
import com.pulsewatch.util.SsrfValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class AsyncPingWorker {

    private final WebClient monitoringWebClient;
    private final SsrfValidator ssrfValidator;
    private final HeartbeatRepository heartbeatRepository;
    private final MonitorRepository monitorRepository;
    private final IncidentService incidentService;

    @Value("${app.monitoring.user-agent:PulseWatch-UptimeBot/1.0}")
    private String userAgent;

    @Async("monitoringExecutor")
    public void pingMonitor(Monitor monitor) {
        Instant startTime = Instant.now();
        long responseTimeMs = 0;
        Integer statusCode = null;
        boolean isUp = false;
        String errorMessage = null;

        try {
            // Step 1: Validate SSRF
            ssrfValidator.validateUrl(monitor.getTargetUrl());

            // Step 2: Perform Non-Blocking HTTP Request
            org.springframework.http.HttpMethod method = monitor.getHttpMethod() == HttpMethod.HEAD
                    ? org.springframework.http.HttpMethod.HEAD
                    : org.springframework.http.HttpMethod.GET;

            var response = monitoringWebClient.method(method)
                    .uri(monitor.getTargetUrl())
                    .header("User-Agent", userAgent)
                    .exchangeToMono(clientResponse -> {
                        return clientResponse.bodyToMono(Void.class)
                                .thenReturn(clientResponse.statusCode().value());
                    })
                    .timeout(Duration.ofSeconds(10))
                    .block();

            responseTimeMs = Duration.between(startTime, Instant.now()).toMillis();
            statusCode = response;

            int expected = monitor.getExpectedStatusCode() != null ? monitor.getExpectedStatusCode() : 200;
            if (statusCode != null && statusCode == expected) {
                isUp = true;
            } else {
                isUp = false;
                errorMessage = "Expected status " + expected + " but received " + statusCode;
            }

        } catch (SsrfValidationException e) {
            responseTimeMs = Duration.between(startTime, Instant.now()).toMillis();
            isUp = false;
            errorMessage = "SSRF Blocked: " + e.getMessage();
            log.warn("SSRF Blocked check for monitor {}: {}", monitor.getId(), e.getMessage());
        } catch (Exception e) {
            responseTimeMs = Duration.between(startTime, Instant.now()).toMillis();
            isUp = false;
            errorMessage = extractErrorMessage(e);
            log.debug("HTTP ping failed for monitor {} [{}]: {}", monitor.getId(), monitor.getTargetUrl(), errorMessage);
        }

        Instant checkTime = Instant.now();

        // Step 3: Record Heartbeat
        Heartbeat heartbeat = Heartbeat.builder()
                .monitor(monitor)
                .status(isUp ? MonitorStatus.UP : MonitorStatus.DOWN)
                .statusCode(statusCode)
                .responseTimeMs(responseTimeMs)
                .errorMessage(errorMessage)
                .checkedAt(checkTime)
                .build();
        heartbeatRepository.save(heartbeat);

        // Step 4: Update Monitor's last_checked_at
        monitor.setLastCheckedAt(checkTime);
        monitorRepository.save(monitor);

        // Step 5: Incident state transitions
        if (isUp) {
            incidentService.handleRecovery(monitor);
        } else {
            incidentService.handleFailure(monitor, errorMessage);
        }
    }

    private String extractErrorMessage(Throwable t) {
        if (t == null) return "Unknown error";
        String msg = t.getMessage();
        if (msg == null || msg.isBlank()) {
            msg = t.getClass().getSimpleName();
        }
        if (msg.contains("TimeoutException") || msg.contains("timed out")) {
            return "Connection Timed Out (> 10s)";
        }
        if (msg.contains("UnknownHostException")) {
            return "DNS Resolution Failed";
        }
        if (msg.contains("SSL") || msg.contains("CertificateException")) {
            return "SSL/TLS Handshake Error";
        }
        if (msg.contains("Connection refused")) {
            return "Connection Refused";
        }
        return msg.length() > 500 ? msg.substring(0, 500) : msg;
    }
}
