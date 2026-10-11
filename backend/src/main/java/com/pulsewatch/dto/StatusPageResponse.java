package com.pulsewatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusPageResponse {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private Boolean isPublic;
    private List<MonitorResponse> monitors;
    private Instant createdAt;
}
