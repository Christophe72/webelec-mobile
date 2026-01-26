package com.webelec.backend.navigation.repository;

import com.webelec.backend.navigation.domain.UserCompanyAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserCompanyAssignmentRepository extends JpaRepository<UserCompanyAssignment, UUID> {

    Optional<UserCompanyAssignment> findByUserId(Long userId);
}
