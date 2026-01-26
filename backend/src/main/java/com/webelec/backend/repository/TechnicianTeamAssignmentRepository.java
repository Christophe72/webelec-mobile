package com.webelec.backend.repository;

import com.webelec.backend.model.TechnicianTeamAssignment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TechnicianTeamAssignmentRepository extends JpaRepository<TechnicianTeamAssignment, Long> {

    @EntityGraph(attributePaths = {"team"})
    Optional<TechnicianTeamAssignment> findFirstByUtilisateurIdAndEndedAtIsNullOrderByAssignedAtDesc(Long utilisateurId);
}
