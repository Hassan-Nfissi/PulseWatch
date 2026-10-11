package com.pulsewatch.service;

import com.pulsewatch.model.Incident;
import com.pulsewatch.model.IncidentStatus;
import com.pulsewatch.model.Monitor;
import com.pulsewatch.model.MonitorStatus;
import com.pulsewatch.repository.IncidentRepository;
import com.pulsewatch.repository.MonitorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final MonitorRepository monitorRepository;
    private final AlertService alertService;

    @Transactional
    public void handleFailure(Monitor monitor, String cause) {
        if (monitor.getStatus() == MonitorStatus.DOWN) {
            // Already down, keep current open incident active
            return;
        }

        log.warn("Monitor '{}' [ID: {}] transitioned to DOWN. Reason: {}", monitor.getName(), monitor.getId(), cause);
        monitor.setStatus(MonitorStatus.DOWN);
        monitorRepository.save(monitor);

        Incident incident = Incident.builder()
                .monitor(monitor)
                .status(IncidentStatus.OPEN)
                .startedAt(Instant.now())
                .cause(cause)
                .build();
        Incident savedIncident = incidentRepository.save(incident);

        alertService.sendIncidentOpenAlert(monitor, savedIncident);
    }

    @Transactional
    public void handleRecovery(Monitor monitor) {
        if (monitor.getStatus() == MonitorStatus.UP) {
            // Already up
            return;
        }

        log.info("Monitor '{}' [ID: {}] transitioned to UP (Recovered).", monitor.getName(), monitor.getId());
        monitor.setStatus(MonitorStatus.UP);
        monitorRepository.save(monitor);

        Optional<Incident> openIncidentOpt = incidentRepository
                .findFirstByMonitorAndStatusOrderByStartedAtDesc(monitor, IncidentStatus.OPEN);

        if (openIncidentOpt.isPresent()) {
            Incident incident = openIncidentOpt.get();
            Instant now = Instant.now();
            incident.setStatus(IncidentStatus.RESOLVED);
            incident.setResolvedAt(now);
            long duration = Duration.between(incident.getStartedAt(), now).toSeconds();
            incident.setDurationSeconds(Math.max(0, duration));
            Incident savedIncident = incidentRepository.save(incident);

            alertService.sendIncidentResolvedAlert(monitor, savedIncident);
        }
    }
}
