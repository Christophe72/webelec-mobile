package com.webelec.navigation.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackages = "com.webelec.navigation")
@EnableJpaRepositories(basePackages = "com.webelec.navigation")
public class NavigationJpaConfiguration {
    // Configuration JPA pour le module navigation
    // Les repositories et entités du package navigation seront automatiquement détectés
}
