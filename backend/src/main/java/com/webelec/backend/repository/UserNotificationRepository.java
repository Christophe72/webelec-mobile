package com.webelec.backend.repository;

import com.webelec.backend.model.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
    long countByUtilisateurIdAndReadFalse(Long utilisateurId);
}
