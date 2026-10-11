package com.pulsewatch.worker;

import com.pulsewatch.model.Monitor;
import com.pulsewatch.repository.MonitorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MonitoringScheduler {

    private final MonitorRepository monitorRepository;
    private final AsyncPingWorker asyncPingWorker;

    @Scheduled(fixedRateString = "${app.monitoring.scheduler-rate-ms:10000}")
    public void schedulePings() {
        try {
            List<Monitor> activeMonitors = monitorRepository.findAllByIsPausedFalse();
            Instant now = Instant.now();

            for (Monitor monitor : activeMonitors) {
                if (isDueForCheck(monitor, now)) {
                    asyncPingWorker.pingMonitor(monitor);
                }
            }
        } catch (Exception e) {
            log.error("Error in MonitoringScheduler loop: {}", e.getMessage(), e);
        }
    }

    private boolean isDueForCheck(Monitor monitor, Instant now) {
        if (monitor.getLastCheckedAt() == null) {
            return true;
        }
        int intervalSeconds = monitor.getCheckIntervalSeconds() != null ? monitor.getCheckIntervalSeconds() : 60;
        long elapsedSeconds = Duration.between(monitor.getLastCheckedAt(), now).toSeconds();
        return elapsedSeconds >= intervalSeconds;
    }
}
