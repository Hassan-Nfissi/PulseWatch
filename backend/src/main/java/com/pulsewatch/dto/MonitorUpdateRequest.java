package com.pulsewatch.dto;

import com.pulsewatch.model.HttpMethod;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonitorUpdateRequest {

    @NotBlank(message = "Monitor name is required")
    private String name;

    @NotBlank(message = "Target URL is required")
    private String targetUrl;

    @NotNull(message = "HTTP Method is required")
    private HttpMethod httpMethod;

    @NotNull(message = "Check interval is required")
    @Min(value = 10, message = "Interval must be at least 10 seconds")
    @Max(value = 86400, message = "Interval must not exceed 24 hours")
    private Integer checkIntervalSeconds;

    @NotNull(message = "Expected status code is required")
    @Min(100)
    @Max(599)
    private Integer expectedStatusCode;
}
