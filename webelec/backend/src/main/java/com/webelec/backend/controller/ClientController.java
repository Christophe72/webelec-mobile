package com.webelec.backend.controller;

import com.webelec.backend.dto.ClientRequest;
import com.webelec.backend.dto.ClientResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientService service;

    public ClientController(ClientService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClientResponse> getAll() {
        return service.findAll().stream().map(ClientResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}")
    public List<ClientResponse> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId).stream().map(ClientResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ClientResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ClientResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));
    }

    @PostMapping
    public ClientResponse create(@Valid @RequestBody ClientRequest request) {
        var created = service.create(request.toEntity());
        return ClientResponse.from(created);
    }

    @PutMapping("/{id}")
    public ClientResponse update(@PathVariable Long id, @Valid @RequestBody ClientRequest request) {
        var updated = service.update(id, request.toEntity());
        return ClientResponse.from(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}