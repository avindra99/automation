package com.verizon.upgrade.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serverId;
    private String hostname;
    private String softwareName;
    private String fromVersion;
    private String toVersion;
    private String status; // SUCCESS, FAILED, IN_PROGRESS
    private String triggeredBy; // User ID or name
    private LocalDateTime timestamp;

    @Column(length = 2000)
    private String logOutput;
}
