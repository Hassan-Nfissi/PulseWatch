package com.pulsewatch.service;

import com.pulsewatch.dto.*;
import com.pulsewatch.model.*;
import com.pulsewatch.repository.IncidentRepository;
import com.pulsewatch.repository.MonitorRepository;
import com.pulsewatch.repository.StatusPageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatusPageService {

    private final StatusPageRepository statusPageRepository;
    private final MonitorRepository monitorRepository;
    private final IncidentRepository incidentRepository;
    private final MonitorService monitorService;

    public List<StatusPageResponse> getUserStatusPages(User user) {
        return statusPageRepository.findByUserOrderByIdDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StatusPageResponse getStatusPageById(Long id, User user) {
        StatusPage page = statusPageRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Status page not found with id: " + id));
        return mapToResponse(page);
    }

    @Transactional
    public StatusPageResponse createStatusPage(StatusPageCreateRequest request, User user) {
        if (statusPageRepository.existsBySlug(request.getSlug().trim().toLowerCase())) {
            throw new IllegalArgumentException("Slug already taken: " + request.getSlug());
        }

        Set<Monitor> monitors = new HashSet<>();
        if (request.getMonitorIds() != null && !request.getMonitorIds().isEmpty()) {
            for (Long monitorId : request.getMonitorIds()) {
                monitorRepository.findByIdAndUser(monitorId, user).ifPresent(monitors::add);
            }
        }

        StatusPage page = StatusPage.builder()
                .user(user)
                .title(request.getTitle().trim())
                .slug(request.getSlug().trim().toLowerCase())
                .description(request.getDescription())
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : true)
                .monitors(monitors)
                .build();

        StatusPage saved = statusPageRepository.save(page);
        return mapToResponse(saved);
    }

    @Transactional
    public StatusPageResponse updateStatusPage(Long id, StatusPageUpdateRequest request, User user) {
        StatusPage page = statusPageRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Status page not found with id: " + id));

        String newSlug = request.getSlug().trim().toLowerCase();
        if (!page.getSlug().equals(newSlug) && statusPageRepository.existsBySlug(newSlug)) {
            throw new IllegalArgumentException("Slug already taken: " + newSlug);
        }

        page.setTitle(request.getTitle().trim());
        page.setSlug(newSlug);
        page.setDescription(request.getDescription());
        if (request.getIsPublic() != null) {
            page.setIsPublic(request.getIsPublic());
        }

        if (request.getMonitorIds() != null) {
            Set<Monitor> monitors = new HashSet<>();
            for (Long monitorId : request.getMonitorIds()) {
                monitorRepository.findByIdAndUser(monitorId, user).ifPresent(monitors::add);
            }
            page.setMonitors(monitors);
        }

        StatusPage updated = statusPageRepository.save(page);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteStatusPage(Long id, User user) {
        StatusPage page = statusPageRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Status page not found with id: " + id));
        statusPageRepository.delete(page);
    }

    @Transactional(readOnly = true)
    public PublicStatusPageResponse getPublicStatusPage(String slug) {
        StatusPage page = statusPageRepository.findBySlug(slug.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Public status page not found for slug: " + slug));

        if (!Boolean.TRUE.equals(page.getIsPublic())) {
            throw new IllegalArgumentException("This status page is private");
        }

        Set<Monitor> monitors = page.getMonitors();

        int total = monitors.size();
        long downCount = monitors.stream().filter(m -> m.getStatus() == MonitorStatus.DOWN).count();

        String overallStatus = "ALL_OPERATIONAL";
        if (total > 0) {
            if (downCount == total) {
                overallStatus = "MAJOR_OUTAGE";
            } else if (downCount > 0) {
                overallStatus = "DEGRADED";
            }
        }

        List<PublicMonitorItemResponse> monitorItems = monitors.stream()
                .map(m -> PublicMonitorItemResponse.builder()
                        .id(m.getId())
                        .name(m.getName())
                        .status(m.getStatus())
                        .lastCheckedAt(m.getLastCheckedAt())
                        .build())
                .sorted(Comparator.comparing(PublicMonitorItemResponse::getName))
                .collect(Collectors.toList());

        // Fetch recent incidents for linked monitors
        List<IncidentResponse> incidents = new ArrayList<>();
        for (Monitor m : monitors) {
            incidentRepository.findByMonitorOrderByStartedAtDesc(m).stream()
                    .limit(5)
                    .forEach(inc -> incidents.add(IncidentResponse.builder()
                            .id(inc.getId())
                            .monitorId(m.getId())
                            .monitorName(m.getName())
                            .status(inc.getStatus())
                            .startedAt(inc.getStartedAt())
                            .resolvedAt(inc.getResolvedAt())
                            .durationSeconds(inc.getDurationSeconds())
                            .cause(inc.getCause())
                            .createdAt(inc.getCreatedAt())
                            .build()));
        }

        incidents.sort(Comparator.comparing(IncidentResponse::getStartedAt).reversed());
        List<IncidentResponse> topIncidents = incidents.stream().limit(10).collect(Collectors.toList());

        return PublicStatusPageResponse.builder()
                .title(page.getTitle())
                .slug(page.getSlug())
                .description(page.getDescription())
                .overallStatus(overallStatus)
                .monitors(monitorItems)
                .recentIncidents(topIncidents)
                .build();
    }

    private StatusPageResponse mapToResponse(StatusPage page) {
        List<MonitorResponse> monitorResponses = page.getMonitors().stream()
                .map(monitorService::mapToResponse)
                .collect(Collectors.toList());

        return StatusPageResponse.builder()
                .id(page.getId())
                .title(page.getTitle())
                .slug(page.getSlug())
                .description(page.getDescription())
                .isPublic(page.getIsPublic())
                .monitors(monitorResponses)
                .createdAt(page.getCreatedAt())
                .build();
    }
}
