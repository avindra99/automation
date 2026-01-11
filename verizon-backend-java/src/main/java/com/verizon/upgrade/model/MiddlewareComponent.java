package com.verizon.upgrade.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "components")
public class MiddlewareComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String currentVersion;
    private String vulnerabilityCount; // e.g. "3 Critical" or "0"
    private String targetVersion;
    private String status;
    private String installPath;

    public MiddlewareComponent(String name, String type, String currentVersion, String vulnerabilityCount,
            String targetVersion, String status, String installPath) {
        this.name = name;
        this.type = type;
        this.currentVersion = currentVersion;
        this.vulnerabilityCount = vulnerabilityCount;
        this.targetVersion = targetVersion;
        this.status = status;
        this.installPath = installPath;
    }
}
