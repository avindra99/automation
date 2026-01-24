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
                    // Prepare command for Ansible Playbook execution
                    // extra-vars format: key1=val1 key2=val2
                    String extraVars = String.format(
                            "target_software=%s target_version=%s install_path=%s repo_url=%s",
                            component.getType(), targetVersion, component.getInstallPath(),
                            "http://repo.verizon.com/middleware/binaries");

                    // Path to the enterprise master playbook
                    String playbookPath = "ansible/site.yml";

                    ProcessBuilder pb = new ProcessBuilder(
                            "ansible-playbook",
                            playbookPath,
                            "-i", targetServer.getHostname() + ",",
                            "--extra-vars", extraVars);

                    pb.redirectErrorStream(true);
                    Process process = pb.start();

                    // Capture output for logging/auditing
                    java.io.BufferedReader reader = new java.io.BufferedReader(
                            new java.io.InputStreamReader(process.getInputStream()));
                    StringBuilder output = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        output.append(line).append("\n");
                    }

                    int exitCode = process.waitFor();

                    if (exitCode == 0) {
                        // Update Database on success
                        component.setCurrentVersion(targetVersion);
                        component.setStatus("Up to Date");

                        boolean allUpToDate = targetServer.getComponents().stream()
                                .allMatch(c -> "Up to Date".equals(c.getStatus()));
                        if (allUpToDate) {
                            targetServer.setStatus("Up to Date");
                        }

                        serverRepository.save(targetServer);

                        auditService.log(serverIdStr, targetServer.getHostname(), componentName, fromVersion,
                                targetVersion, "SUCCESS", "UI_USER",
                                "Ansible playbook execution successful.\nOutput:\n" + output.toString());
                    } else {
                        throw new RuntimeException(
                                "Ansible failed with exit code " + exitCode + ". Output:\n" + output.toString());
                    }

                } catch (Exception e) {
                    auditService.log(serverIdStr, targetServer.getHostname(), componentName, fromVersion,
                            targetVersion, "FAILED", "UI_USER", "Error during automation: " + e.getMessage());
                }
            }
        }
    }
}
