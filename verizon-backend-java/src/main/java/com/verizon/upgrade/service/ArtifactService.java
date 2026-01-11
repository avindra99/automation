package com.verizon.upgrade.service;

import com.verizon.upgrade.model.SoftwareArtifact;
import com.verizon.upgrade.repository.SoftwareArtifactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArtifactService {
    @Autowired
    private SoftwareArtifactRepository repository;

    public SoftwareArtifact upload(String name, String version, String type, String filename, long size) {
        SoftwareArtifact artifact = new SoftwareArtifact();
        artifact.setName(name);
        artifact.setVersion(version);
        artifact.setType(type);
        artifact.setFilename(filename);
        artifact.setArtifactoryPath("https://artifactory.verizon.com/repro/" + name + "/" + version + "/" + filename);
        artifact.setSizeBytes(size);
        artifact.setUploadedAt(LocalDateTime.now());
        return repository.save(artifact);
    }

    public List<SoftwareArtifact> getAll() {
        return repository.findAll();
    }
}
