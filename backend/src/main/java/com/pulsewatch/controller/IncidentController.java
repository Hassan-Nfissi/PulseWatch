package com.pulsewatch.controller;

import com.pulsewatch.dto.IncidentResponse;
import com.pulsewatch.model.Incident;
import com.pulsewatch.model.Monitor;
import com.pulsewatch.model.User;
import com.pulsewatch.repository.IncidentRepository;
import com.pulsewatch.service.MonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentRepository incidentRepository;
    private final MonitorService monitorService;

    @GetMapping("/incidents")
    public ResponseEntity<List<IncidentResponse>> getUserIncidents(@AuthenticationPrincipal User user) {
        List<IncidentResponse> responses = incidentRepository.findByUserOrderByStartedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/monitors/{id}/incidents")
    public ResponseEntity<List<IncidentResponse>> getMonitorIncidents(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        Monitor monitor = monitorService.getMonitorEntity(id, user);
        List<IncidentResponse> responses = incidentRepository.findByMonitorOrderByStartedAtDesc(monitor)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    private IncidentResponse mapToResponse(Incident inc) {
        return IncidentResponse.builder()
                .id(inc.getId())
                .monitorId(inc.getMonitor().getId())
                .monitorName(inc.getMonitor().getName())
                .status(inc.getStatus())
                .startedAt(inc.getStartedAt())
                .resolvedAt(inc.getResolvedAt())
                .durationSeconds(inc.getDurationSeconds())
                .cause(inc.getCause())
                .createdAt(inc.getCreatedAt())
                .build();
    }
}
