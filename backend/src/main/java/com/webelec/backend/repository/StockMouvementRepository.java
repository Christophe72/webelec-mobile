package com.webelec.backend.repository;

import com.webelec.backend.model.StockMouvement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMouvementRepository extends JpaRepository<StockMouvement, Long> {
}
