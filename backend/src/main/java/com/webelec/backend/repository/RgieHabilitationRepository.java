package com.webelec.backend.repository;

import com.webelec.backend.model.RgieHabilitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RgieHabilitationRepository extends JpaRepository<RgieHabilitation, Long> {
    List<RgieHabilitation> findByUtilisateurId(Long utilisateurId);
}
