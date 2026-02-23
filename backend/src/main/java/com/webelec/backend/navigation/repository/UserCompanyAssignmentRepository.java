package com.webelec.backend.navigation.repository;

import com.webelec.backend.navigation.domain.UserCompanyAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCompanyAssignmentRepository extends JpaRepository<UserCompanyAssignment, java.util.UUID> {

    Optional<UserCompanyAssignment> findByUserId(Long userId);
}
