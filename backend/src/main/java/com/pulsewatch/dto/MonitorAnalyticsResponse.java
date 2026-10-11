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
public class MonitorAnalyticsResponse {
    private MonitorResponse monitor;
    private double uptime30d;
    private List<HeartbeatResponse> heartbeats;
}
