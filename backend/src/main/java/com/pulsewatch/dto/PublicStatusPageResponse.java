package com.pulsewatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicStatusPageResponse {
    private String title;
    private String slug;
    private String description;
    private String overallStatus; // "ALL_OPERATIONAL", "DEGRADED", "MAJOR_OUTAGE"
    private List<PublicMonitorItemResponse> monitors;
    private List<IncidentResponse> recentIncidents;
}
