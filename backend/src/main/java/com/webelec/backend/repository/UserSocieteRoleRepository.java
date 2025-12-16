package com.webelec.backend.repository;

import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.UserSocieteRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSocieteRoleRepository extends JpaRepository<UserSocieteRole, UserSocieteRoleId> {
    List<UserSocieteRole> findByUtilisateurId(Long utilisateurId);
    List<UserSocieteRole> findBySocieteId(Long societeId);
}
