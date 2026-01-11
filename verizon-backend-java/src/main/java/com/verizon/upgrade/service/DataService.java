package com.verizon.upgrade.service;

import com.verizon.upgrade.model.*;
import com.verizon.upgrade.repository.ApplicationRepository;
import com.verizon.upgrade.repository.EnvironmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DataService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private EnvironmentRepository environmentRepository;

    @PostConstruct
    public void init() {
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationByVastId(String vastId) {
        return applicationRepository.findByVastId(vastId).orElse(null);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id).orElse(null);
    }

    @Transactional
    public Application saveApplicationWithInventory(String name, String vastId, List<Map<String, Object>> envsData,
            Long existingId) {

        Application app;
        if (existingId != null) {
            app = applicationRepository.findById(existingId).orElse(new Application());
        } else {
            Optional<Application> existingByVast = applicationRepository.findByVastId(vastId);
            app = existingByVast.orElse(new Application());
        }

        app.setName(name);
        app.setVastId(vastId);

        // If the application is already persisted, we need to clear environments to
        // handle removals
        if (app.getId() != null) {
            if (app.getEnvironments() != null) {
                app.getEnvironments().clear();
            } else {
                app.setEnvironments(new ArrayList<>());
            }
        } else {
            app.setEnvironments(new ArrayList<>());
        }

        // Pre-save to ensure we have an ID for the application
        app = applicationRepository.saveAndFlush(app);
        final Long appId = app.getId();

        if (envsData != null) {
            for (Map<String, Object> envData : envsData) {
                String envName = (String) envData.get("name");
                if (envName == null || (!envName.equalsIgnoreCase("Non-Prod") && !envName.equalsIgnoreCase("Prod"))) {
                    continue;
                }

                Environment env = new Environment();
                env.setName(envName);
                env.setAppId(appId);
                env.setServers(new ArrayList<>());

                // Save environment to get its ID
                env = environmentRepository.saveAndFlush(env);
                final Long envId = env.getId();

                @SuppressWarnings("unchecked")
                List<Map<String, Object>> serversData = (List<Map<String, Object>>) envData.get("servers");
                if (serversData != null) {
                    for (int i = 0; i < serversData.size(); i++) {
                        Map<String, Object> serverData = serversData.get(i);
                        String hostname = (String) serverData.get("hostname");
                        if (hostname == null || hostname.isEmpty())
                            continue;

                        Server server = new Server();
                        server.setHostname(hostname);
                        server.setIp("10." + (int) (Math.random() * 255) + "." + (int) (Math.random() * 255) + "."
                                + (i + 1));
                        server.setAppId(appId);
                        server.setEnvId(envId);
                        server.setStatus("Outdated");

                        List<MiddlewareComponent> components = new ArrayList<>();
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> componentsData = (List<Map<String, Object>>) serverData
                                .get("components");

                        if (componentsData != null && !componentsData.isEmpty()) {
                            for (Map<String, Object> compData : componentsData) {
                                MiddlewareComponent comp = new MiddlewareComponent(
                                        (String) compData.get("name"),
                                        (String) compData.get("type"),
                                        (String) compData.get("currentVersion"),
                                        (String) compData.get("vulnerabilityCount"),
                                        (String) compData.get("targetVersion"),
                                        (String) compData.get("status"),
                                        (String) compData.get("installPath"));
                                components.add(comp);
                            }
                        } else {
                            // Default Java component if none provided
                            MiddlewareComponent java = new MiddlewareComponent("Java", "Java", "1.8.0.211",
                                    "2 Critical",
                                    "11.0.12", "Outdated", "/opt/verizon/java");
                            components.add(java);
                        }

                        server.setComponents(components);
                        env.getServers().add(server);
                    }
                }
                // Save environment again to persist servers
                environmentRepository.save(env);
                app.getEnvironments().add(env);
            }
        }

        return applicationRepository.save(app);
    }

    public Application createApplication(Application newApp) {
        return applicationRepository.save(newApp);
    }

    public boolean updateApplication(Long id, Application updatedApp) {
        if (applicationRepository.existsById(id)) {
            updatedApp.setId(id);
            applicationRepository.save(updatedApp);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean deleteApplication(Long id) {
        if (applicationRepository.existsById(id)) {
            applicationRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
