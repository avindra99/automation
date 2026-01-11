package com.verizon.upgrade.controller;

import com.verizon.upgrade.model.AuditLog;
import com.verizon.upgrade.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {
    @Autowired
    private AuditService auditService;

    @GetMapping
    public List<AuditLog> getHistory(@RequestParam(required = false) String serverId) {
        return auditService.getHistory(serverId);
    }
}
