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
public class HeartbeatResponse {
    private Long id;
    private MonitorStatus status;
    private Integer statusCode;
    private Long responseTimeMs;
    private String errorMessage;
    private Instant checkedAt;
}
