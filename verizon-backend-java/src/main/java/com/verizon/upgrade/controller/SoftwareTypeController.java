package com.verizon.upgrade.controller;

import com.verizon.upgrade.model.SoftwareType;
import com.verizon.upgrade.service.SoftwareTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/software-types")
@CrossOrigin(origins = "*")
public class SoftwareTypeController {
    @Autowired
    private SoftwareTypeService service;

    @GetMapping
    public List<SoftwareType> getAll() {
        return service.getAll();
    }

    @PostMapping
    public SoftwareType create(@RequestBody SoftwareType type) {
        return service.save(type);
    }
}
