package com.webelec.navigation.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackages = {"com.webelec.backend", "com.webelec.navigation"})
@EnableJpaRepositories(basePackages = {"com.webelec.backend", "com.webelec.navigation"})
public class NavigationJpaConfiguration {
    // Configuration JPA pour l'application complète (backend + navigation)
    // Scanne les entités et repositories des deux packages
}
