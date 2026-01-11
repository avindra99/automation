package com.verizon.upgrade.service;

import com.verizon.upgrade.model.Application;
import com.verizon.upgrade.model.Environment;
import com.verizon.upgrade.model.MiddlewareComponent;
import com.verizon.upgrade.model.Server;
import com.verizon.upgrade.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AutomationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private com.verizon.upgrade.repository.ServerRepository serverRepository;

    @Autowired
    private AuditService auditService;

    @Async
    public void runUpgrade(String serverIdStr, String componentName, String targetVersion) {
        Long serverId = Long.valueOf(serverIdStr);
        Optional<Server> serverOpt = serverRepository.findById(serverId);

        if (serverOpt.isPresent()) {
            Server targetServer = serverOpt.get();
            MiddlewareComponent component = null;
            for (MiddlewareComponent c : targetServer.getComponents()) {
                if (c.getName().equalsIgnoreCase(componentName)) {
                    component = c;
                    break;
                }
            }

            if (component != null) {
                String fromVersion = component.getCurrentVersion();

                try {
                    Thread.sleep(5000); // Simulate time taken for upgrade

                    // Update Database
                    component.setCurrentVersion(targetVersion);
                    component.setStatus("Up to Date");

                    // Check if all components on server are up to date to update server status
                    boolean allUpToDate = targetServer.getComponents().stream()
                            .allMatch(c -> c.getStatus().equals("Up to Date"));
                    if (allUpToDate) {
                        targetServer.setStatus("Up to Date");
                    }

                    serverRepository.save(targetServer);

                    // Log Audit
                    auditService.log(serverIdStr, targetServer.getHostname(), componentName, fromVersion,
                            targetVersion, "SUCCESS", "UI_USER",
                            "Ansible playbook executed successfully. Software updated to " + targetVersion);

                } catch (Exception e) {
                    auditService.log(serverIdStr, targetServer.getHostname(), componentName, fromVersion,
                            targetVersion, "FAILED", "UI_USER", "Error: " + e.getMessage());
                }
            }
        }
    }
}
