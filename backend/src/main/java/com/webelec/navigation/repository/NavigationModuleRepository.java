package com.webelec.navigation.repository;

import com.webelec.navigation.domain.NavigationModule;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavigationModuleRepository extends JpaRepository<NavigationModule, Long> {

    @EntityGraph(attributePaths = {"permission", "requiredLicense"})
    List<NavigationModule> findByActiveTrueOrderByDisplayOrderAsc();
}
