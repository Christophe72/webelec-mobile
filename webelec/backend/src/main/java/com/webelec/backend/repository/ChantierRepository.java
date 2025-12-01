package com.webelec.backend.repository;

import com.webelec.backend.model.Chantier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChantierRepository extends JpaRepository<Chantier, Long> {
    List<Chantier> findBySocieteId(Long societeId);
}
