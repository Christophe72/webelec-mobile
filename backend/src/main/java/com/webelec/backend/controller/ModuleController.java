package com.webelec.backend.controller;

import com.webelec.backend.dto.ModuleRequest;
import com.webelec.backend.dto.ModuleResponse;
import com.webelec.backend.dto.ModuleUpdateRequest;
import com.webelec.backend.service.ModuleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    private final ModuleService service;

    public ModuleController(ModuleService service) {
        this.service = service;
    }

    @GetMapping
    public List<ModuleResponse> getAll() {
        return service.findAll().stream()
                .map(ModuleResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ModuleResponse getById(@PathVariable Long id) {
        return ModuleResponse.from(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ModuleResponse> create(@Valid @RequestBody ModuleRequest request) {
        var created = service.create(request.toEntity());
        return ResponseEntity.ok(ModuleResponse.from(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModuleResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody ModuleUpdateRequest request) {
        var updated = service.update(id, request);
        return ResponseEntity.ok(ModuleResponse.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
