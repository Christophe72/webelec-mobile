package com.webelec.backend.service;

import com.webelec.backend.model.Client;
import com.webelec.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Optional<Client> findById(Long id) {
        return repository.findById(id);
    }

    public Client create(Client client) {
        return repository.save(client);
    }

    public Client update(Long id, Client client) {
        Client existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Client non trouvé"));
        existing.setNom(client.getNom());
        existing.setPrenom(client.getPrenom());
        existing.setEmail(client.getEmail());
        existing.setTelephone(client.getTelephone());
        existing.setAdresse(client.getAdresse());
        existing.setSociete(client.getSociete());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
