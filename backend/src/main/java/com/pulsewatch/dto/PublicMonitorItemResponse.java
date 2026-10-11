package com.pulsewatch.dto;

import com.pulsewatch.model.MonitorStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicMonitorItemResponse {
    private Long id;
    private String name;
    private MonitorStatus status;
    private Instant lastCheckedAt;
}
