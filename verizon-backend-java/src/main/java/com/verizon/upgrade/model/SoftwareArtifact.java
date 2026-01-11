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
@Table(name = "software_artifacts")
public class SoftwareArtifact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String version;
    private String type; // JAVA, OPENSSL, etc.
    private String filename;
    private String artifactoryPath;
    private long sizeBytes;
    private LocalDateTime uploadedAt;
}
