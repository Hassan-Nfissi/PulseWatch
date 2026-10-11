package com.pulsewatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalMonitors;
    private long upMonitors;
    private long downMonitors;
    private long pausedMonitors;
    private double overallUptime30d;
}
