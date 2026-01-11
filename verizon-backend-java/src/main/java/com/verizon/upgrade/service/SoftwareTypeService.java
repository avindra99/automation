package com.verizon.upgrade.service;

import com.verizon.upgrade.model.SoftwareType;
import com.verizon.upgrade.repository.SoftwareTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;

@Service
public class SoftwareTypeService {
    @Autowired
    private SoftwareTypeRepository repository;

    @PostConstruct
    public void init() {
        if (repository.count() == 0) {
            save(new SoftwareType(null, "JAVA", "/opt/java", "Java Runtime Environment"));
            save(new SoftwareType(null, "OPENSSL", "/usr/local/ssl", "Secure Sockets Layer library"));
            save(new SoftwareType(null, "PYTHON", "/opt/python", "Python Interpreter"));
            save(new SoftwareType(null, "NODEJS", "/opt/node", "Node.js Runtime"));
        }
    }

    public List<SoftwareType> getAll() {
        return repository.findAll();
    }

    public SoftwareType save(SoftwareType type) {
        return repository.save(type);
    }
}
