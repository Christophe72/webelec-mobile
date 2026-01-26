package com.webelec.backend.config;

import com.webelec.backend.security.DevAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@Profile("dev")
@EnableMethodSecurity
public class DevSecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final DevAuthenticationFilter devAuthenticationFilter;

    public DevSecurityConfig(CorsConfigurationSource corsConfigurationSource,
                             DevAuthenticationFilter devAuthenticationFilter) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.devAuthenticationFilter = devAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain devSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .addFilterBefore(devAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
