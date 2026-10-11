package com.pulsewatch.controller;

import com.pulsewatch.dto.StatusPageCreateRequest;
import com.pulsewatch.dto.StatusPageResponse;
import com.pulsewatch.dto.StatusPageUpdateRequest;
import com.pulsewatch.model.User;
import com.pulsewatch.service.StatusPageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/status-pages")
@RequiredArgsConstructor
public class StatusPageAdminController {

    private final StatusPageService statusPageService;

    @GetMapping
    public ResponseEntity<List<StatusPageResponse>> listStatusPages(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(statusPageService.getUserStatusPages(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StatusPageResponse> getStatusPage(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(statusPageService.getStatusPageById(id, user));
    }

    @PostMapping
    public ResponseEntity<StatusPageResponse> createStatusPage(
            @Valid @RequestBody StatusPageCreateRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(statusPageService.createStatusPage(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StatusPageResponse> updateStatusPage(
            @PathVariable Long id,
            @Valid @RequestBody StatusPageUpdateRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(statusPageService.updateStatusPage(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatusPage(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        statusPageService.deleteStatusPage(id, user);
        return ResponseEntity.noContent().build();
    }
}
