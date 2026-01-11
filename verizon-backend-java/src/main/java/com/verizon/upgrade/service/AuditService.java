package com.verizon.upgrade.service;

import com.verizon.upgrade.model.AuditLog;
import com.verizon.upgrade.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String serverId, String hostname, String software, String from, String to, String status,
            String user, String output) {
        AuditLog log = new AuditLog();
        log.setServerId(serverId);
        log.setHostname(hostname);
        log.setSoftwareName(software);
        log.setFromVersion(from);
        log.setToVersion(to);
        log.setStatus(status);
        log.setTriggeredBy(user);
        log.setTimestamp(LocalDateTime.now());
        log.setLogOutput(output);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getHistory(String serverId) {
        if (serverId == null)
            return auditLogRepository.findAll();
        return auditLogRepository.findByServerIdOrderByTimestampDesc(serverId);
    }
}
