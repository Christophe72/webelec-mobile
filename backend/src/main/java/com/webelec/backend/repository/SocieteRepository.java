package com.webelec.backend.repository;

import com.webelec.backend.model.Societe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocieteRepository extends JpaRepository<Societe, Long> {
    Societe findByEmail(String email);
}