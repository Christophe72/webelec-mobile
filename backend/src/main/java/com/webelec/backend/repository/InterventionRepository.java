package com.webelec.backend.repository;

import com.webelec.backend.model.Intervention;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    @EntityGraph(attributePaths = {"societe", "chantier", "client", "utilisateur", "utilisateur.societes", "utilisateur.societes.societe"})
    @Query("select i from Intervention i")
    List<Intervention> findAllWithDetails();

    @EntityGraph(attributePaths = {"societe", "chantier", "client", "utilisateur", "utilisateur.societes", "utilisateur.societes.societe"})
    @Query("select i from Intervention i where i.societe.id = :societeId")
    List<Intervention> findBySocieteIdWithDetails(@Param("societeId") Long societeId);

    @EntityGraph(attributePaths = {"societe", "chantier", "client", "utilisateur", "utilisateur.societes", "utilisateur.societes.societe"})
    @Query("select i from Intervention i where i.chantier.id = :chantierId")
    List<Intervention> findByChantierIdWithDetails(@Param("chantierId") Long chantierId);

    @EntityGraph(attributePaths = {"societe", "chantier", "client", "utilisateur", "utilisateur.societes", "utilisateur.societes.societe"})
    @Query("select i from Intervention i where i.id = :id")
    Optional<Intervention> findByIdWithDetails(@Param("id") Long id);

    List<Intervention> findBySocieteId(Long societeId);
    List<Intervention> findByChantierId(Long chantierId);
}