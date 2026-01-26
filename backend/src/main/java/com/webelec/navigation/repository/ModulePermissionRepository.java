package com.webelec.navigation.repository;

import com.webelec.navigation.domain.ModulePermission;
import com.webelec.navigation.domain.ModulePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ModulePermissionRepository extends JpaRepository<ModulePermission, ModulePermissionId> {

    List<ModulePermission> findByModuleCodeIn(Collection<String> moduleCodes);
}
