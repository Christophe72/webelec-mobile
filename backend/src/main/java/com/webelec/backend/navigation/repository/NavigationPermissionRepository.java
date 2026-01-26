package com.webelec.backend.navigation.repository;

import com.webelec.backend.navigation.domain.NavigationPermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NavigationPermissionRepository extends JpaRepository<NavigationPermission, String> {

    Optional<NavigationPermission> findByCode(String code);
}
