package com.webelec.navigation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "role_permissions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"role_code", "permission_code"}))
@IdClass(RolePermissionId.class)
public class RolePermission {

    @Id
    @Column(name = "role_code", length = 100)
    private String roleCode;

    @Id
    @Column(name = "permission_code", length = 100)
    private String permissionCode;

    public RolePermission() {
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public String getPermissionCode() {
        return permissionCode;
    }

    public void setPermissionCode(String permissionCode) {
        this.permissionCode = permissionCode;
    }
}
