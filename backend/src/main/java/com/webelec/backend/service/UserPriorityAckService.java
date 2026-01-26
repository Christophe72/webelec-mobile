package com.webelec.backend.service;

import com.webelec.backend.model.UserPriorityAck;
import com.webelec.backend.repository.UserPriorityAckRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserPriorityAckService {

    private final UserPriorityAckRepository repository;

    public UserPriorityAckService(UserPriorityAckRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void acknowledge(Long userId, String priorityId) {
        if (repository.existsByUserIdAndPriorityId(userId, priorityId)) {
            return;
        }

        UserPriorityAck ack = new UserPriorityAck(userId, priorityId);
        repository.save(ack);
    }

    public List<String> getAcknowledgedPriorities(Long userId) {
        return repository.findByUserId(userId)
            .stream()
            .map(UserPriorityAck::getPriorityId)
            .toList();
    }

    public List<UserPriorityAck> getAcknowledgedPrioritiesWithTimestamp(Long userId) {
        return repository.findByUserId(userId);
    }
}
