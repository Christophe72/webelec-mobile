package com.webelec.backend;

import com.webelec.backend.config.JwtProperties;
import com.webelec.backend.config.SocieteSeedProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties({SocieteSeedProperties.class, JwtProperties.class})
@SpringBootApplication(scanBasePackages = {"com.webelec.backend", "com.webelec.navigation"})
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}