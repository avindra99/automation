package com.verizon.upgrade;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class UpgradeAutomationApplication {

	public static void main(String[] args) {
		SpringApplication.run(UpgradeAutomationApplication.class, args);
	}

}
