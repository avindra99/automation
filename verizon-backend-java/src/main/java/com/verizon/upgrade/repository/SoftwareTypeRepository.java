package com.verizon.upgrade.repository;

import com.verizon.upgrade.model.SoftwareType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SoftwareTypeRepository extends JpaRepository<SoftwareType, Long> {
    Optional<SoftwareType> findByNameIgnoreCase(String name);
}
