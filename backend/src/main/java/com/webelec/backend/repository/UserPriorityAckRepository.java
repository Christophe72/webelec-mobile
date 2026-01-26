package com.webelec.backend.repository;

import com.webelec.backend.model.UserPriorityAck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPriorityAckRepository extends JpaRepository<UserPriorityAck, Long> {

    boolean existsByUserIdAndPriorityId(Long userId, String priorityId);

    List<UserPriorityAck> findByUserId(Long userId);
}
