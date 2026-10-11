package com.pulsewatch.dto;

import com.pulsewatch.model.HttpMethod;
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
public class MonitorResponse {
    private Long id;
    private String name;
    private String targetUrl;
    private HttpMethod httpMethod;
    private Integer checkIntervalSeconds;
    private Integer expectedStatusCode;
    private Boolean isPaused;
    private MonitorStatus status;
    private Instant lastCheckedAt;
    private Double uptime30d;
    private Long lastResponseTimeMs;
    private Instant createdAt;
}
