package com.webelec.backend.config;

import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.SocieteRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder {

    private final SocieteRepository societeRepository;

    public DataSeeder(SocieteRepository societeRepository) {
        this.societeRepository = societeRepository;
    }

    @PostConstruct
    public void seed() {
        if (societeRepository.count() > 0) {
            return;
        }

        societeRepository.save(createSociete("ElecPro", "FR12345678901", "contact@elecpro.fr", "01 23 45 67 89", "12 rue des Ouvriers, Paris"));
        societeRepository.save(createSociete("VoltServices", "FR22345678901", "bonjour@voltservices.fr", "02 98 76 54 32", "43 avenue de Lyon, Lyon"));
        societeRepository.save(createSociete("CourantPlus", "FR32345678901", "support@courantplus.fr", "03 66 55 44 33", "5 boulevard de Provence, Marseille"));
    }

    private Societe createSociete(String nom, String tva, String email, String telephone, String adresse) {
        return Societe.builder()
                .nom(nom)
                .tva(tva)
                .email(email)
                .telephone(telephone)
                .adresse(adresse)
                .build();
    }
}
