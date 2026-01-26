package com.webelec.backend.navigation.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "navigation_role_permissions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"role_code", "permission_code"}))
public class NavigationRolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_code", nullable = false)
    private NavigationRole role;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "permission_code", nullable = false)
    private NavigationPermission permission;

    public NavigationRolePermission() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NavigationRole getRole() {
        return role;
    }

    public void setRole(NavigationRole role) {
        this.role = role;
    }

    public NavigationPermission getPermission() {
        return permission;
    }

    public void setPermission(NavigationPermission permission) {
        this.permission = permission;
    }
}
