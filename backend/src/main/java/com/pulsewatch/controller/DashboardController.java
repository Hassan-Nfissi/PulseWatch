package com.pulsewatch.controller;

import com.pulsewatch.dto.DashboardStatsResponse;
import com.pulsewatch.dto.MonitorAnalyticsResponse;
import com.pulsewatch.model.User;
import com.pulsewatch.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getStats(user));
    }

    @GetMapping("/monitors/{id}/analytics")
    public ResponseEntity<MonitorAnalyticsResponse> getAnalytics(
            @PathVariable Long id,
            @RequestParam(defaultValue = "24h") String range,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getMonitorAnalytics(id, user, range));
    }
}
