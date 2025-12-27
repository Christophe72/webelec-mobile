package com.webelec.backend.service;

import com.webelec.backend.dto.DevisRequest;
import com.webelec.backend.exception.ConflictException;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Devis;
import com.webelec.backend.repository.DevisRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DevisService {

    private final DevisRepository repository;

    public DevisService(DevisRepository repository) {
        this.repository = repository;
    }

    public List<Devis> findAll() {
        return repository.findAll();
    }

    public Devis findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devis non trouvé"));
    }

    public Devis create(DevisRequest request) {
        if (repository.existsByNumero(request.getNumero())) {
            throw new ConflictException("Numéro de devis déjà utilisé");
        }
        return repository.save(request.toEntity());
    }

    public Devis update(Long id, DevisRequest request) {
        Devis existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devis non trouvé"));

        if (!existing.getNumero().equals(request.getNumero()) && repository.existsByNumero(request.getNumero())) {
            throw new ConflictException("Numéro de devis déjà utilisé");
        }

        existing.setNumero(request.getNumero());
        existing.setSociete(request.toEntity().getSociete());
        existing.setClient(request.toEntity().getClient());
        existing.setMontantHT(request.getMontantHT());
        existing.setMontantTVA(request.getMontantTVA());
        existing.setMontantTTC(request.getMontantTTC());
        existing.setStatut(request.getStatut());
        existing.setDateEmission(request.getDateEmission());
        existing.setDateExpiration(request.getDateExpiration());
        existing.setLignes(request.toEntity().getLignes());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Devis non trouvé");
        }
        repository.deleteById(id);
    }
}