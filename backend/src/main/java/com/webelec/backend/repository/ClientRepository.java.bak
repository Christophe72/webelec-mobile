package com.webelec.backend.repository;

import com.webelec.backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findBySocieteId(Long societeId);
    Client findByEmail(String email);
    boolean existsByEmail(String email);
}