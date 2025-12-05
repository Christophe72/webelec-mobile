package com.webelec.backend.repository;

import com.webelec.backend.model.ProduitAvance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProduitAvanceRepository extends JpaRepository<ProduitAvance, Long> {
    List<ProduitAvance> findBySocieteId(Long societeId);
}
