package com.webelec.backend.config;

import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.SocieteRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder {

    private final SocieteRepository societeRepository;
    private final SocieteSeedProperties seedProperties;

    public DataSeeder(SocieteRepository societeRepository, SocieteSeedProperties seedProperties) {
        this.societeRepository = societeRepository;
        this.seedProperties = seedProperties;
    }

    @PostConstruct
    public void seed() {
        if (societeRepository.count() > 0 || seedProperties.getSocietes().isEmpty()) {
            return;
        }

        seedProperties.getSocietes().forEach(entry -> societeRepository.save(createSociete(entry)));
    }

    private Societe createSociete(SocieteSeedProperties.Societe entry) {
        return Societe.builder()
                .nom(entry.getNom())
                .tva(entry.getTva())
                .email(entry.getEmail())
                .telephone(entry.getTelephone())
                .adresse(entry.getAdresse())
                .build();
    }
}