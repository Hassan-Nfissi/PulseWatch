package com.pulsewatch.repository;

import com.pulsewatch.model.Heartbeat;
import com.pulsewatch.model.Monitor;
import com.pulsewatch.model.MonitorStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface HeartbeatRepository extends JpaRepository<Heartbeat, Long> {

    List<Heartbeat> findByMonitorAndCheckedAtAfterOrderByCheckedAtAsc(Monitor monitor, Instant after);

    List<Heartbeat> findByMonitorOrderByCheckedAtDesc(Monitor monitor, Pageable pageable);

    @Query("SELECT COUNT(h) FROM Heartbeat h WHERE h.monitor = :monitor AND h.checkedAt >= :since")
    long countTotalByMonitorAndCheckedAtAfter(Monitor monitor, Instant since);

    @Query("SELECT COUNT(h) FROM Heartbeat h WHERE h.monitor = :monitor AND h.status = :status AND h.checkedAt >= :since")
    long countByMonitorAndStatusAndCheckedAtAfter(Monitor monitor, MonitorStatus status, Instant since);

    @Modifying
    @Query("DELETE FROM Heartbeat h WHERE h.checkedAt < :before")
    int deleteByCheckedAtBefore(Instant before);
}
