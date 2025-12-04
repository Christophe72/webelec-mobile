package com.webelec.backend;

import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.ClientRepository;
import com.webelec.backend.repository.SocieteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@SpringBootTest
class ClientRepositoryTest {

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

    @Autowired
    ClientRepository clientRepo;

    @Autowired
    SocieteRepository societeRepo;

    @Test
    void save_and_find() {
        // Créer d'abord une société (obligatoire car Client a une relation ManyToOne)
        Societe societe = new Societe();
        societe.setNom("Test Company");
        societe.setTva("FR12345678901");
        societe.setAdresse("123 Test Street");
        Societe savedSociete = societeRepo.save(societe);

        // Créer et sauvegarder le client
        Client c = new Client();
        c.setNom("Test");
        c.setPrenom("JUnit");
        c.setSociete(savedSociete);

        Client saved = clientRepo.save(c);
        assertNotNull(saved.getId());

        Client found = clientRepo.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals("Test", found.getNom());
        assertEquals("JUnit", found.getPrenom());
    }
}
