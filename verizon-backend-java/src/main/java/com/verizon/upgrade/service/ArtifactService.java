package com.verizon.upgrade.service;

import com.verizon.upgrade.model.SoftwareArtifact;
import com.verizon.upgrade.repository.SoftwareArtifactRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ArtifactService {
    @Autowired
    private SoftwareArtifactRepository repository;

    // Use a relative path for local development, would be
    // /apps/opt/application/mw/software/ on Linux
    private final String BASE_PATH = "./software_repository";

    public SoftwareArtifact upload(String name, String version, String type, MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        long size = file.getSize();

        // Create directory structure: BASE/type/version/
        Path targetDir = Paths.get(BASE_PATH, type.toLowerCase(), version);
        Files.createDirectories(targetDir);

        Path targetPath = targetDir.resolve(filename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        log.info("Software binary saved to: {}", targetPath.toAbsolutePath());

        SoftwareArtifact artifact = new SoftwareArtifact();
        artifact.setName(name);
        artifact.setVersion(version);
        artifact.setType(type.toUpperCase());
        artifact.setFilename(filename);
        // Store the local absolute path for the automation engine to use
        artifact.setArtifactoryPath(targetPath.toAbsolutePath().toString());
        artifact.setSizeBytes(size);
        artifact.setUploadedAt(LocalDateTime.now());

        return repository.save(artifact);
    }

    public List<SoftwareArtifact> getAll() {
        return repository.findAll();
    }

    public List<SoftwareArtifact> getByType(String type) {
        return repository.findByType(type.toUpperCase());
    }
}
