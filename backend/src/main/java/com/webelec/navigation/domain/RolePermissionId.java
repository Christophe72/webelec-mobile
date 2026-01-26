package com.webelec.navigation.domain;

import java.io.Serializable;
import java.util.Objects;

public class RolePermissionId implements Serializable {

    private static final long serialVersionUID = 1L;

    private String roleCode;
    private String permissionCode;

    public RolePermissionId() {
    }

    public RolePermissionId(String roleCode, String permissionCode) {
        this.roleCode = roleCode;
        this.permissionCode = permissionCode;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RolePermissionId that = (RolePermissionId) o;
        return Objects.equals(roleCode, that.roleCode)
            && Objects.equals(permissionCode, that.permissionCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleCode, permissionCode);
    }
}
