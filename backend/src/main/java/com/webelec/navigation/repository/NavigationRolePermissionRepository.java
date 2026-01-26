package com.webelec.backend.navigation.repository;

import com.webelec.backend.navigation.domain.NavigationRolePermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavigationRolePermissionRepository extends JpaRepository<NavigationRolePermission, Long> {

    List<NavigationRolePermission> findByRoleCode(String roleCode);
}
