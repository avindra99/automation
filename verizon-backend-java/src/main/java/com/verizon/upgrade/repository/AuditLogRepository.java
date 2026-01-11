package com.verizon.upgrade.repository;

import com.verizon.upgrade.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByServerIdOrderByTimestampDesc(String serverId);
}
