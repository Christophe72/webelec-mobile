package com.webelec.navigation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "module_permissions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"module_code", "permission_code"}))
@IdClass(ModulePermissionId.class)
public class ModulePermission {

    @Id
    @Column(name = "module_code", length = 100)
    private String moduleCode;

    @Id
    @Column(name = "permission_code", length = 100)
    private String permissionCode;

    public ModulePermission() {
    }

    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    }

    public String getPermissionCode() {
        return permissionCode;
    }

    public void setPermissionCode(String permissionCode) {
        this.permissionCode = permissionCode;
    }
}
