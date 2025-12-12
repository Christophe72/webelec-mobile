package com.webelec.backend.repository;

import com.webelec.backend.model.PieceJustificative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PieceJustificativeRepository extends JpaRepository<PieceJustificative, Long> {

    List<PieceJustificative> findByInterventionId(Long interventionId);

    List<PieceJustificative> findByDevisId(Long devisId);

    List<PieceJustificative> findByFactureId(Long factureId);
}
