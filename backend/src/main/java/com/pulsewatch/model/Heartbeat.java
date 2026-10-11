package com.pulsewatch.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(
    name = "heartbeats",
    indexes = {
        @Index(name = "idx_heartbeats_monitor_checked", columnList = "monitor_id, checked_at DESC"),
        @Index(name = "idx_heartbeats_checked_at", columnList = "checked_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Heartbeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "monitor_id", nullable = false)
    private Monitor monitor;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MonitorStatus status;

    @Column(name = "status_code")
    private Integer statusCode;

    @Column(name = "response_time_ms")
    private Long responseTimeMs;

    @Column(name = "error_message", length = 1024)
    private String errorMessage;

    @Column(name = "checked_at", nullable = false)
    private Instant checkedAt;

    @PrePersist
    protected void onCreate() {
        if (this.checkedAt == null) {
            this.checkedAt = Instant.now();
        }
    }
}
