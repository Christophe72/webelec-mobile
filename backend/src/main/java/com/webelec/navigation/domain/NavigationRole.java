package com.webelec.navigation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "navigation_roles")
public class NavigationRole {

    @Id
    @Column(name = "code", length = 100)
    private String code;

    @Column(name = "label", nullable = false, length = 255)
    private String label;

    public NavigationRole() {
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
}
