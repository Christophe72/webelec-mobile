package com.webelec.backend.repository;

import com.webelec.backend.model.CalculHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalculHistoryRepository extends JpaRepository<CalculHistory, Long> {
    List<CalculHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<CalculHistory> findByUserIdAndChantierId(Long userId, Long chantierId);
    List<CalculHistory> findByUserIdAndCalculatorType(Long userId, String calculatorType);
}
