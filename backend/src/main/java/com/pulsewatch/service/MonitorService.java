package com.pulsewatch.service;

import com.pulsewatch.dto.MonitorCreateRequest;
import com.pulsewatch.dto.MonitorResponse;
import com.pulsewatch.dto.MonitorUpdateRequest;
import com.pulsewatch.model.Heartbeat;
import com.pulsewatch.model.Monitor;
import com.pulsewatch.model.MonitorStatus;
import com.pulsewatch.model.User;
import com.pulsewatch.repository.HeartbeatRepository;
import com.pulsewatch.repository.MonitorRepository;
import com.pulsewatch.util.SsrfValidator;
import com.pulsewatch.worker.AsyncPingWorker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MonitorService {

    private final MonitorRepository monitorRepository;
    private final HeartbeatRepository heartbeatRepository;
    private final SsrfValidator ssrfValidator;
    private final AsyncPingWorker asyncPingWorker;

    public List<MonitorResponse> getMonitorsForUser(User user) {
        return monitorRepository.findByUserOrderByIdDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MonitorResponse getMonitorByIdForUser(Long id, User user) {
        Monitor monitor = monitorRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found with id: " + id));
        return mapToResponse(monitor);
    }

    public Monitor getMonitorEntity(Long id, User user) {
        return monitorRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found with id: " + id));
    }

    @Transactional
    public MonitorResponse createMonitor(MonitorCreateRequest request, User user) {
        // Upfront SSRF validation check
        ssrfValidator.validateUrl(request.getTargetUrl());

        Monitor monitor = Monitor.builder()
                .user(user)
                .name(request.getName().trim())
                .targetUrl(request.getTargetUrl().trim())
                .httpMethod(request.getHttpMethod())
                .checkIntervalSeconds(request.getCheckIntervalSeconds())
                .expectedStatusCode(request.getExpectedStatusCode())
                .isPaused(false)
                .status(MonitorStatus.UP)
                .build();

        Monitor saved = monitorRepository.save(monitor);

        // Trigger immediate initial check
        try {
            asyncPingWorker.pingMonitor(saved);
        } catch (Exception e) {
            log.warn("Immediate initial ping failed for monitor {}: {}", saved.getId(), e.getMessage());
        }

        return mapToResponse(saved);
    }

    @Transactional
    public MonitorResponse updateMonitor(Long id, MonitorUpdateRequest request, User user) {
        Monitor monitor = monitorRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found with id: " + id));

        ssrfValidator.validateUrl(request.getTargetUrl());

        monitor.setName(request.getName().trim());
        monitor.setTargetUrl(request.getTargetUrl().trim());
        monitor.setHttpMethod(request.getHttpMethod());
        monitor.setCheckIntervalSeconds(request.getCheckIntervalSeconds());
        monitor.setExpectedStatusCode(request.getExpectedStatusCode());

        Monitor updated = monitorRepository.save(monitor);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteMonitor(Long id, User user) {
        Monitor monitor = monitorRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found with id: " + id));
        monitorRepository.delete(monitor);
    }

    @Transactional
    public MonitorResponse pauseMonitor(Long id, User user) {
        Monitor monitor = monitorRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found with id: " + id));

        monitor.setIsPaused(true);
        monitor.setStatus(MonitorStatus.PAUSED);
        Monitor saved = monitorRepository.save(monitor);
        return mapToResponse(saved);
    }

    @Transactional
    public MonitorResponse resumeMonitor(Long id, User user) {
        Monitor monitor = monitorRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found with id: " + id));

        monitor.setIsPaused(false);
        monitor.setStatus(MonitorStatus.UP);
        Monitor saved = monitorRepository.save(monitor);

        // Immediately trigger check on resume
        asyncPingWorker.pingMonitor(saved);

        return mapToResponse(saved);
    }

    public double calculate30DayUptime(Monitor monitor) {
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        long total = heartbeatRepository.countTotalByMonitorAndCheckedAtAfter(monitor, thirtyDaysAgo);
        if (total == 0) {
            return 100.0; // Default when no checks yet
        }
        long up = heartbeatRepository.countByMonitorAndStatusAndCheckedAtAfter(monitor, MonitorStatus.UP, thirtyDaysAgo);
        double uptime = ((double) up / (double) total) * 100.0;
        return Math.round(uptime * 100.0) / 100.0;
    }

    public MonitorResponse mapToResponse(Monitor monitor) {
        double uptime30d = calculate30DayUptime(monitor);

        // Fetch last heartbeat for response time
        List<Heartbeat> lastHeartbeats = heartbeatRepository.findByMonitorOrderByCheckedAtDesc(
                monitor, PageRequest.of(0, 1)
        );
        Long lastResponseTime = (lastHeartbeats != null && !lastHeartbeats.isEmpty())
                ? lastHeartbeats.get(0).getResponseTimeMs()
                : null;

        return MonitorResponse.builder()
                .id(monitor.getId())
                .name(monitor.getName())
                .targetUrl(monitor.getTargetUrl())
                .httpMethod(monitor.getHttpMethod())
                .checkIntervalSeconds(monitor.getCheckIntervalSeconds())
                .expectedStatusCode(monitor.getExpectedStatusCode())
                .isPaused(monitor.getIsPaused())
                .status(monitor.getStatus())
                .lastCheckedAt(monitor.getLastCheckedAt())
                .uptime30d(uptime30d)
                .lastResponseTimeMs(lastResponseTime)
                .createdAt(monitor.getCreatedAt())
                .build();
    }
}
