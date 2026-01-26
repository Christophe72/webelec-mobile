package com.webelec.navigation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "navigation_sections")
public class NavigationSection {

    @Id
    @Column(name = "code", length = 100)
    private String code;

    @Column(name = "label", nullable = false, length = 255)
    private String label;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    public NavigationSection() {
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

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
