package com.webelec.backend.repository;

import com.webelec.backend.model.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findBySocieteId(Long societeId);
    List<Intervention> findByChantierId(Long chantierId);
}
