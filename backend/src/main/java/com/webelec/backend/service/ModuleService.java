package com.webelec.backend.service;

import com.webelec.backend.dto.ModuleUpdateRequest;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Module;
import com.webelec.backend.repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleService {

    private final ModuleRepository repository;

    public ModuleService(ModuleRepository repository) {
        this.repository = repository;
    }

    public List<Module> findAll() {
        return repository.findAll();
    }

    public Module findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module non trouvé"));
    }

    public Module create(Module module) {
        return repository.save(module);
    }

    public Module update(Long id, ModuleUpdateRequest request) {
        Module existing = findById(id);

        if (request.getNom() != null) {
            existing.setNom(request.getNom());
        }
        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription());
        }
        if (request.getCategorie() != null) {
            existing.setCategorie(request.getCategorie());
        }
        if (request.getVersion() != null) {
            existing.setVersion(request.getVersion());
        }
        if (request.getActif() != null) {
            existing.setActif(request.getActif());
        }

        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Module non trouvé");
        }
        repository.deleteById(id);
    }
}
