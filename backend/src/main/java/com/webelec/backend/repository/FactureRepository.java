package com.webelec.backend.repository;

import com.webelec.backend.model.Facture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findBySocieteId(Long societeId);
    List<Facture> findByClientId(Long clientId);
    List<Facture> findBySocieteIdAndClientId(Long societeId, Long clientId);
    Facture findByNumero(String numero);
    boolean existsByNumeroAndSocieteId(String numero, Long societeId);
}
