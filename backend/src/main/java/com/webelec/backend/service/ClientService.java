package com.webelec.backend.service;

import com.webelec.backend.dto.ClientRequest;
import com.webelec.backend.exception.ConflictException;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository repository;

    public ClientService(ClientRepository repository) {
        this.repository = repository;
    }

    public List<Client> findAll() {
        return repository.findAll();
    }

    public List<Client> findBySociete(Long societeId) {
        return repository.findBySocieteId(societeId);
    }

    public Client findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));
    }

    public Client create(ClientRequest request) {
        if (request.getEmail() != null && repository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email déjà utilisé");
        }
        Client client = request.toEntity();
        return repository.save(client);
    }

    public Client update(Long id, ClientRequest request) {
        Client existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            Client other = repository.findByEmail(request.getEmail());
            if (other != null && !other.getId().equals(id)) {
                throw new ConflictException("Email déjà utilisé");
            }
        }

        existing.setNom(request.getNom());
        existing.setPrenom(request.getPrenom());
        existing.setEmail(request.getEmail());
        existing.setTelephone(request.getTelephone());
        existing.setAdresse(request.getAdresse());
        if (existing.getSociete() == null || !existing.getSociete().getId().equals(request.getSocieteId())) {
            Societe societe = new Societe();
            societe.setId(request.getSocieteId());
            existing.setSociete(societe);
        }
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Client non trouvé");
        }
        repository.deleteById(id);
    }
}