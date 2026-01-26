package com.webelec.navigation.repository;

import com.webelec.navigation.domain.NavigationSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavigationSectionRepository extends JpaRepository<NavigationSection, String> {

    List<NavigationSection> findAllByOrderByDisplayOrderAsc();
}
