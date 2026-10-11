package com.pulsewatch.dto;

import com.pulsewatch.model.IncidentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {
    private Long id;
    private Long monitorId;
    private String monitorName;
    private IncidentStatus status;
    private Instant startedAt;
    private Instant resolvedAt;
    private Long durationSeconds;
    private String cause;
    private Instant createdAt;
}
