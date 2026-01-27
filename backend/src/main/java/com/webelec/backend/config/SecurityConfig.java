package com.webelec.backend.config;

import com.webelec.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@Profile({"prod", "test"})
@EnableMethodSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                    // Protection XSS: empêche l'injection de scripts malveillants
                    .xssProtection(xss -> xss
                        .headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                    // Protection Clickjacking: empêche l'application d'être chargée dans une iframe
                    .frameOptions(frame -> frame.deny())
                    // Content-Type Options: empêche le navigateur de deviner le type MIME
                    .contentTypeOptions(contentType -> {})
                    // HSTS: force HTTPS pendant 1 an
                    .httpStrictTransportSecurity(hsts -> hsts
                        .includeSubDomains(true)
                        .maxAgeInSeconds(31536000)
                    )
                )
                .exceptionHandling(ex -> ex
                    // Retourne 401 au lieu de 403 pour les utilisateurs non authentifiés
                    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                .authorizeHttpRequests(auth -> auth
                    // Endpoints publics : authentification et Swagger
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                    // Endpoints de health check (optionnel)
                    .requestMatchers("/actuator/health").permitAll()
                    .requestMatchers(
                        "/api/dashboard/**",
                        "/api/devis/**",
                        "/api/clients/**",
                        "/api/catalogue/**",
                        "/api/produits/**",
                        "/api/produits-avances/**",
                        "/api/stock/**"
                    ).hasRole("ARTISAN")
                    .requestMatchers("/api/chantiers/**")
                    .hasAnyRole("ARTISAN", "TECH", "AUDITEUR")
                    .requestMatchers("/api/rgie/**")
                    .hasAnyRole("ARTISAN", "TECH", "AUDITEUR")
                    .requestMatchers("/api/audit/**")
                    .hasRole("AUDITEUR")
                    // Tous les autres endpoints nécessitent une authentification
                    .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
