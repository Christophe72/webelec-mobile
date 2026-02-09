package com.webelec.backend.repository;

import com.webelec.backend.model.UserPreferences;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {
    Optional<UserPreferences> findByUserId(Long userId);
    long deleteByUserId(Long userId);
}
