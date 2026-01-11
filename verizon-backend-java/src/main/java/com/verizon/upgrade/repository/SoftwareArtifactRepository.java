package com.verizon.upgrade.repository;

import com.verizon.upgrade.model.SoftwareArtifact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoftwareArtifactRepository extends JpaRepository<SoftwareArtifact, Long> {
}
