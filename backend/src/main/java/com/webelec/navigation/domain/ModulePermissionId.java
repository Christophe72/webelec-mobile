package com.webelec.navigation.domain;

import java.io.Serializable;
import java.util.Objects;

public class ModulePermissionId implements Serializable {

    private static final long serialVersionUID = 1L;

    private String moduleCode;
    private String permissionCode;

    public ModulePermissionId() {
    }

    public ModulePermissionId(String moduleCode, String permissionCode) {
        this.moduleCode = moduleCode;
        this.permissionCode = permissionCode;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ModulePermissionId that = (ModulePermissionId) o;
        return Objects.equals(moduleCode, that.moduleCode)
            && Objects.equals(permissionCode, that.permissionCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(moduleCode, permissionCode);
    }
}
