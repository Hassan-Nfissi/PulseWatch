package com.pulsewatch.service;

import com.pulsewatch.dto.DashboardStatsResponse;
import com.pulsewatch.dto.HeartbeatResponse;
import com.pulsewatch.dto.MonitorAnalyticsResponse;
import com.pulsewatch.dto.MonitorResponse;
import com.pulsewatch.model.Heartbeat;
import com.pulsewatch.model.Monitor;
import com.pulsewatch.model.User;
import com.pulsewatch.repository.HeartbeatRepository;
import com.pulsewatch.repository.MonitorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MonitorRepository monitorRepository;
    private final HeartbeatRepository heartbeatRepository;
    private final MonitorService monitorService;

    public DashboardStatsResponse getStats(User user) {
        List<Monitor> monitors = monitorRepository.findByUserOrderByIdDesc(user);
        long total = monitors.size();
        long paused = monitors.stream().filter(m -> Boolean.TRUE.equals(m.getIsPaused())).count();
        long up = monitors.stream().filter(m -> !Boolean.TRUE.equals(m.getIsPaused()) && "UP".equals(m.getStatus().name())).count();
        long down = monitors.stream().filter(m -> !Boolean.TRUE.equals(m.getIsPaused()) && "DOWN".equals(m.getStatus().name())).count();

        double totalUptime = 0.0;
        int counted = 0;
        for (Monitor m : monitors) {
            totalUptime += monitorService.calculate30DayUptime(m);
            counted++;
        }
        double avgUptime = counted > 0 ? Math.round((totalUptime / counted) * 100.0) / 100.0 : 100.0;

        return DashboardStatsResponse.builder()
                .totalMonitors(total)
                .upMonitors(up)
                .downMonitors(down)
                .pausedMonitors(paused)
                .overallUptime30d(avgUptime)
                .build();
    }

    public MonitorAnalyticsResponse getMonitorAnalytics(Long monitorId, User user, String range) {
        Monitor monitor = monitorService.getMonitorEntity(monitorId, user);
        MonitorResponse monitorResponse = monitorService.mapToResponse(monitor);

        int hours = 24;
        if ("7d".equalsIgnoreCase(range)) {
            hours = 24 * 7;
        } else if ("30d".equalsIgnoreCase(range)) {
            hours = 24 * 30;
        }

        Instant since = Instant.now().minus(hours, ChronoUnit.HOURS);
        List<Heartbeat> heartbeats = heartbeatRepository.findByMonitorAndCheckedAtAfterOrderByCheckedAtAsc(monitor, since);

        List<HeartbeatResponse> heartbeatResponses = heartbeats.stream()
                .map(h -> HeartbeatResponse.builder()
                        .id(h.getId())
                        .status(h.getStatus())
                        .statusCode(h.getStatusCode())
                        .responseTimeMs(h.getResponseTimeMs())
                        .errorMessage(h.getErrorMessage())
                        .checkedAt(h.getCheckedAt())
                        .build())
                .collect(Collectors.toList());

        return MonitorAnalyticsResponse.builder()
                .monitor(monitorResponse)
                .uptime30d(monitorService.calculate30DayUptime(monitor))
                .heartbeats(heartbeatResponses)
                .build();
    }
}
