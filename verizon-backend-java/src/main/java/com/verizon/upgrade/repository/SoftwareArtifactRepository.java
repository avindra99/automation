package com.verizon.upgrade.repository;

import com.verizon.upgrade.model.SoftwareArtifact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoftwareArtifactRepository extends JpaRepository<SoftwareArtifact, Long> {
    List<SoftwareArtifact> findByType(String type);
}
