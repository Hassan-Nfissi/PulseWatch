package com.pulsewatch.worker;

import com.pulsewatch.repository.HeartbeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class RetentionCleanupWorker {

    private final HeartbeatRepository heartbeatRepository;

    /**
     * Executes once a day at 03:00 AM UTC to clean up heartbeats older than 30 days.
     */
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void cleanupOldHeartbeats() {
        try {
            Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
            int deletedCount = heartbeatRepository.deleteByCheckedAtBefore(thirtyDaysAgo);
            log.info("RetentionCleanupWorker: Purged {} heartbeat records older than 30 days ({})", deletedCount, thirtyDaysAgo);
        } catch (Exception e) {
            log.error("Failed to execute retention cleanup: {}", e.getMessage(), e);
        }
    }
}
