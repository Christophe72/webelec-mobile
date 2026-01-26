package com.webelec.backend.navigation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "navigation_modules")
public class NavigationModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "label", nullable = false, length = 255)
    private String label;

    @Column(name = "route", nullable = false, length = 255)
    private String route;

    @Column(name = "icon", length = 128)
    private String icon;

    @Column(name = "section_code", nullable = false, length = 100)
    private String sectionCode;

    @Column(name = "section_label", nullable = false, length = 255)
    private String sectionLabel;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "active", nullable = false)
    private boolean active;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "permission_code", nullable = false)
    private NavigationPermission permission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "license_code")
    private NavigationLicense requiredLicense;

    public NavigationModule() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getSectionCode() {
        return sectionCode;
    }

    public void setSectionCode(String sectionCode) {
        this.sectionCode = sectionCode;
    }

    public String getSectionLabel() {
        return sectionLabel;
    }

    public void setSectionLabel(String sectionLabel) {
        this.sectionLabel = sectionLabel;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public NavigationPermission getPermission() {
        return permission;
    }

    public void setPermission(NavigationPermission permission) {
        this.permission = permission;
    }

    public NavigationLicense getRequiredLicense() {
        return requiredLicense;
    }

    public void setRequiredLicense(NavigationLicense requiredLicense) {
        this.requiredLicense = requiredLicense;
    }
}
