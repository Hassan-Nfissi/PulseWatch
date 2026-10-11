package com.pulsewatch.controller;

import com.pulsewatch.dto.MonitorCreateRequest;
import com.pulsewatch.dto.MonitorResponse;
import com.pulsewatch.dto.MonitorUpdateRequest;
import com.pulsewatch.model.User;
import com.pulsewatch.service.MonitorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/monitors")
@RequiredArgsConstructor
public class MonitorController {

    private final MonitorService monitorService;

    @GetMapping
    public ResponseEntity<List<MonitorResponse>> listMonitors(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(monitorService.getMonitorsForUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonitorResponse> getMonitor(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(monitorService.getMonitorByIdForUser(id, user));
    }

    @PostMapping
    public ResponseEntity<MonitorResponse> createMonitor(
            @Valid @RequestBody MonitorCreateRequest request,
            @AuthenticationPrincipal User user) {
        MonitorResponse created = monitorService.createMonitor(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonitorResponse> updateMonitor(
            @PathVariable Long id,
            @Valid @RequestBody MonitorUpdateRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(monitorService.updateMonitor(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMonitor(@PathVariable Long id, @AuthenticationPrincipal User user) {
        monitorService.deleteMonitor(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<MonitorResponse> pauseMonitor(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(monitorService.pauseMonitor(id, user));
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<MonitorResponse> resumeMonitor(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(monitorService.resumeMonitor(id, user));
    }
}
