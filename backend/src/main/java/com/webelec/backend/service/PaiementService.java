package com.webelec.backend.service;

import com.webelec.backend.dto.PaiementRequest;
import com.webelec.backend.model.Facture;
import com.webelec.backend.model.Paiement;
import com.webelec.backend.repository.FactureRepository;
import com.webelec.backend.repository.PaiementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final FactureRepository factureRepository;

    public PaiementService(PaiementRepository paiementRepository, FactureRepository factureRepository) {
        this.paiementRepository = paiementRepository;
        this.factureRepository = factureRepository;
    }

    public Paiement createPaiement(Long factureId, PaiementRequest request) {
        Facture facture = factureRepository.findById(factureId)
            .orElseThrow(() -> new IllegalArgumentException("Facture non trouvée avec l'ID: " + factureId));

        Paiement paiement = new Paiement();
        paiement.setMontant(request.montant());
        paiement.setDate(request.date() != null ? request.date() : LocalDate.now());
        paiement.setMode(request.mode());
        paiement.setReference(request.reference());
        paiement.setFacture(facture);

        return paiementRepository.save(paiement);
    }

    @Transactional(readOnly = true)
    public List<Paiement> getPaiementsByFactureId(Long factureId) {
        return paiementRepository.findByFactureId(factureId);
    }

    @Transactional(readOnly = true)
    public Paiement getPaiementById(Long id) {
        return paiementRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Paiement non trouvé avec l'ID: " + id));
    }

    public void deletePaiement(Long id) {
        if (!paiementRepository.existsById(id)) {
            throw new IllegalArgumentException("Paiement non trouvé avec l'ID: " + id);
        }
        paiementRepository.deleteById(id);
    }
}
