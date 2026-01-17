package com.webelec.backend.repository;

import com.webelec.backend.model.LegalDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LegalDocumentRepository extends JpaRepository<LegalDocument, UUID> {
}
