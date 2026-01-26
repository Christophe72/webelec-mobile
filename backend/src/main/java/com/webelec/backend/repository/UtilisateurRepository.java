package com.webelec.backend.repository;

import com.webelec.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    @EntityGraph(attributePaths = {"societes", "societes.societe"})
    Optional<Utilisateur> findByEmail(String email);
    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = {"societes", "societes.societe"})
    Optional<Utilisateur> findFirstByOrderByIdAsc();
}