package com.webelec.backend.repository;

import com.webelec.backend.model.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    @Query("SELECT p FROM Paiement p WHERE p.facture.id = :factureId ORDER BY p.date DESC")
    List<Paiement> findByFactureId(@Param("factureId") Long factureId);

    @Query("SELECT p FROM Paiement p JOIN FETCH p.facture WHERE p.facture.id = :factureId ORDER BY p.date DESC")
    List<Paiement> findByFactureIdWithFacture(@Param("factureId") Long factureId);
}
