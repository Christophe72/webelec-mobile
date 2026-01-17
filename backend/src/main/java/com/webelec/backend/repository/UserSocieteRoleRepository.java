package com.webelec.backend.repository;

import com.webelec.backend.model.UserSocieteRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserSocieteRoleRepository extends JpaRepository<UserSocieteRole, UUID> {
    List<UserSocieteRole> findByUtilisateurId(Long utilisateurId);
    List<UserSocieteRole> findBySocieteId(Long societeId);
}