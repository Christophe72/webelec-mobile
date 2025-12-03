package com.webelec.backend.repository;

import com.webelec.backend.model.Devis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DevisRepository extends JpaRepository<Devis, Long> {
    List<Devis> findBySocieteId(Long societeId);
    List<Devis> findByClientId(Long clientId);
    Devis findByNumero(String numero);
}