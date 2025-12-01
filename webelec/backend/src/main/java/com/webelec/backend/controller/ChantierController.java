package com.webelec.backend.controller;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.service.ChantierService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chantiers")
@CrossOrigin(origins = "*")
public class ChantierController {

    private final ChantierService service;

    public ChantierController(ChantierService service) {
        this.service = service;
    }

    @GetMapping
    public List<Chantier> getAll() {
        return service.findAll();
    }

    @GetMapping("/societe/{societeId}")
    public List<Chantier> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId);
    }

    @GetMapping("/{id}")
    public Chantier getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Chantier non trouvé"));
    }

    @PostMapping
    public Chantier create(@RequestBody Chantier chantier) {
        return service.create(chantier);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
