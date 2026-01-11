package com.verizon.upgrade.repository;

import com.verizon.upgrade.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    java.util.Optional<Application> findByVastId(String vastId);
}
