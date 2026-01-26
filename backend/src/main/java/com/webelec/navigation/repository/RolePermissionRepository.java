package com.webelec.navigation.repository;

import com.webelec.navigation.domain.RolePermission;
import com.webelec.navigation.domain.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {

    List<RolePermission> findByRoleCode(String roleCode);
}
