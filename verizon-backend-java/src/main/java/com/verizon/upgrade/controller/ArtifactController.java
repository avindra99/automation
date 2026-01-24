package com.verizon.upgrade.controller;

import com.verizon.upgrade.model.SoftwareArtifact;
import com.verizon.upgrade.service.ArtifactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/artifacts")
@CrossOrigin(origins = "*")
public class ArtifactController {
    @Autowired
    private ArtifactService artifactService;

    @PostMapping("/upload")
    public SoftwareArtifact uploadArtifact(
            @RequestParam("name") String name,
            @RequestParam("version") String version,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file) throws Exception {

        return artifactService.upload(name, version, type, file);
    }

    @GetMapping
    public List<SoftwareArtifact> getArtifacts() {
        return artifactService.getAll();
    }
}
