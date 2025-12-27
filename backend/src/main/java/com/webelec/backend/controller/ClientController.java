package com.webelec.backend.controller;

import com.webelec.backend.dto.ClientRequest;
import com.webelec.backend.dto.ClientResponse;
import com.webelec.backend.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService service;

    public ClientController(ClientService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClientResponse> getAll() {
        return service.findAll().stream()
                .map(ClientResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ClientResponse getById(@PathVariable Long id) {
        return ClientResponse.from(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ClientResponse> create(@Valid @RequestBody ClientRequest request) {
        var created = service.create(request);
        return ResponseEntity.ok(ClientResponse.from(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody ClientRequest request) {
        var updated = service.update(id, request);
        return ResponseEntity.ok(ClientResponse.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}