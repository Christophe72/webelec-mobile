package com.webelec.backend.controller;

import com.webelec.backend.model.Societe;
import com.webelec.backend.service.SocieteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/societes")
@CrossOrigin(origins = "*")
public class SocieteController {

    private final SocieteService service;

    public SocieteController(SocieteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Societe> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Societe getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Societe non trouvée"));
    }

    @PostMapping
    public Societe create(@RequestBody Societe societe) {
        return service.create(societe);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
