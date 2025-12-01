package com.webelec.backend.repository;

import com.webelec.backend.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findBySocieteId(Long societeId);
}
