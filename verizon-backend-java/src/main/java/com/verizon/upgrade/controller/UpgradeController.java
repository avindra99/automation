package com.verizon.upgrade.controller;

import com.verizon.upgrade.service.AutomationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/upgrade")
@CrossOrigin(origins = "*")
public class UpgradeController {

    @Autowired
    private AutomationService automationService;

    @PostMapping
    public ResponseEntity<String> triggerUpgrade(@RequestBody Map<String, String> request) {
        String serverId = request.get("serverId");
        String componentName = request.get("componentName");
        String targetVersion = request.get("targetVersion");

        if (serverId != null && componentName != null && targetVersion != null) {
            automationService.runUpgrade(serverId, componentName, targetVersion);
            return ResponseEntity.ok("Upgrade triggered successfully via Automation Engine.");
        }

        return ResponseEntity.badRequest().body("Invalid move: missing parameters");
    }
}
