package com.webelec.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import javax.sql.DataSource;
import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.assertTrue;

@Testcontainers
@SpringBootTest(properties = "spring.profiles.active=test")
@org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable(named = "TESTCONTAINERS_ENABLED", matches = "true")
class DatabaseConnectionTest {

    @SuppressWarnings("resource")
	@Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16")
                    .withDatabaseName("webelec")
                    .withUsername("postgres")
                    .withPassword("postgres");

    @DynamicPropertySource
    static void registerProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void connection_test(@org.springframework.beans.factory.annotation.Autowired DataSource ds) throws Exception {
        try (Connection cn = ds.getConnection()) {
            assertTrue(cn.isValid(2));
        }
    }
}