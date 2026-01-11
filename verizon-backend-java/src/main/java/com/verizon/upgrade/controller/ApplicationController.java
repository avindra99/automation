package com.verizon.upgrade.controller;

import com.verizon.upgrade.model.Application;
import com.verizon.upgrade.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*") // Allow requests from Next.js frontend
public class ApplicationController {

    @Autowired
    private DataService dataService;

    @GetMapping
    public List<Application> getAllApplications() {
        return dataService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplication(@PathVariable Long id) {
        Application app = dataService.getApplicationById(id);
        if (app != null) {
            return ResponseEntity.ok(app);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/vast/{vastId}")
    public ResponseEntity<Application> getApplicationByVastId(@PathVariable String vastId) {
        Application app = dataService.getApplicationByVastId(vastId);
        if (app != null) {
            return ResponseEntity.ok(app);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody Map<String, Object> payload) {
        String action = (String) payload.get("action");
        String name = (String) payload.get("name");
        String vastId = (String) payload.get("vastId");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> envs = (List<Map<String, Object>>) payload.get("envs");

        Long idLong = null;
        Object idObj = payload.get("id");
        if (idObj != null) {
            if (idObj instanceof Number) {
                idLong = ((Number) idObj).longValue();
            } else if (idObj instanceof String && !((String) idObj).isBlank()) {
                try {
                    idLong = Long.parseLong((String) idObj);
                } catch (NumberFormatException e) {
                    // Ignore or handle
                }
            }
        }

        if ("add".equals(action) || "edit".equals(action)) {
            Application app = dataService.saveApplicationWithInventory(name, vastId, envs, idLong);
            return ResponseEntity.ok(app);
        }

        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateApplication(@PathVariable Long id, @RequestBody Application updatedApp) {
        if (dataService.updateApplication(id, updatedApp)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        if (dataService.deleteApplication(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
