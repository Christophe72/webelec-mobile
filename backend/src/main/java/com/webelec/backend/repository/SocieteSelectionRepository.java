package com.webelec.backend.repository;

import com.webelec.backend.model.SocieteSelection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocieteSelectionRepository extends JpaRepository<SocieteSelection, Long> {

    Optional<SocieteSelection> findFirstByUtilisateurIdOrderBySelectedAtDesc(Long utilisateurId);
}
