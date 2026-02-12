package com.webelec.backend.controller;

import com.webelec.backend.dto.FactureImportResponse;
import com.webelec.backend.dto.FactureRequest;
import com.webelec.backend.dto.FactureResponse;
import com.webelec.backend.dto.PaiementRequest;
import com.webelec.backend.dto.PaiementResponse;
import com.webelec.backend.dto.PeppolResultDTO;
import com.webelec.backend.dto.UblDTO;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.service.FactureImportService;
import com.webelec.backend.service.FactureService;
import com.webelec.backend.service.PeppolService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    private final FactureService service;
    private final FactureImportService importService;
    private final PeppolService peppolService;
    private final com.webelec.backend.service.PaiementService paiementService;

    public FactureController(FactureService service, FactureImportService importService, PeppolService peppolService, com.webelec.backend.service.PaiementService paiementService) {
        this.service = service;
        this.importService = importService;
        this.peppolService = peppolService;
        this.paiementService = paiementService;
    }

    @GetMapping
    public List<FactureResponse> getAll() {
        return service.findAll().stream().map(FactureResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}")
    public List<FactureResponse> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId).stream().map(FactureResponse::from).toList();
    }

    @GetMapping("/client/{clientId}")
    public List<FactureResponse> getByClient(@PathVariable Long clientId) {
        return service.findByClient(clientId).stream().map(FactureResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}/client/{clientId}")
    public List<FactureResponse> getBySocieteAndClient(
            @PathVariable Long societeId,
            @PathVariable Long clientId) {
        return service.findBySocieteAndClient(societeId, clientId)
            .stream()
            .map(FactureResponse::from)
            .toList();
    }

    @GetMapping("/{id}")
    public FactureResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(FactureResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée"));
    }

    @PostMapping
    public FactureResponse create(@Valid @RequestBody FactureRequest request) {
        var created = service.create(request.toEntity());
        return FactureResponse.from(created);
    }

    @PutMapping("/{id}")
    public FactureResponse update(@PathVariable Long id, @Valid @RequestBody FactureRequest request) {
        var updated = service.update(id, request.toEntity());
        return FactureResponse.from(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<FactureImportResponse> importInvoices(
            @RequestParam("file") MultipartFile file,
            @RequestParam("societeId") Long societeId) {

        // Validate file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("La taille du fichier ne peut pas dépasser 10MB");
        }

        FactureImportResponse response = importService.importFromCsv(file, societeId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/ubl")
    public UblDTO getUbl(@PathVariable Long id) {
        return peppolService.generateUbl(id);
    }

    @PostMapping("/{id}/peppol")
    public PeppolResultDTO sendPeppol(@PathVariable Long id) {
        return peppolService.envoyer(id);
    }

    @PostMapping("/{id}/paiements")
    public ResponseEntity<PaiementResponse> createPaiement(
            @PathVariable Long id,
            @Valid @RequestBody PaiementRequest request) {
        var paiement = paiementService.createPaiement(id, request);
        return ResponseEntity.ok(PaiementResponse.from(paiement));
    }

    @GetMapping("/{id}/paiements")
    public List<PaiementResponse> getPaiementsByFacture(@PathVariable Long id) {
        return paiementService.getPaiementsByFactureId(id)
            .stream()
            .map(PaiementResponse::from)
            .toList();
    }
}
