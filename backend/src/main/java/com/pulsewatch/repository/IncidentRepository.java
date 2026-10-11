package com.pulsewatch.repository;

import com.pulsewatch.model.Incident;
import com.pulsewatch.model.IncidentStatus;
import com.pulsewatch.model.Monitor;
import com.pulsewatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    Optional<Incident> findFirstByMonitorAndStatusOrderByStartedAtDesc(Monitor monitor, IncidentStatus status);

    List<Incident> findByMonitorOrderByStartedAtDesc(Monitor monitor);

    @Query("SELECT i FROM Incident i WHERE i.monitor.user = :user ORDER BY i.startedAt DESC")
    List<Incident> findByUserOrderByStartedAtDesc(User user);
}
