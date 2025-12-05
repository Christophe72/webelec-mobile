package com.webelec.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.profiles.active=test")
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring context starts without exploding
    }
}