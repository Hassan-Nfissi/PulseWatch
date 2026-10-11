package com.pulsewatch.controller;

import com.pulsewatch.dto.PublicStatusPageResponse;
import com.pulsewatch.service.StatusPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/status")
@RequiredArgsConstructor
public class PublicStatusPageController {

    private final StatusPageService statusPageService;

    @GetMapping("/{slug}")
    public ResponseEntity<PublicStatusPageResponse> getPublicStatusPage(@PathVariable String slug) {
        return ResponseEntity.ok(statusPageService.getPublicStatusPage(slug));
    }
}
