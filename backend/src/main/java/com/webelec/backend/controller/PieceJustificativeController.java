package com.webelec.backend.controller;

import com.webelec.backend.dto.PieceJustificativeResponse;
import com.webelec.backend.service.PieceJustificativeService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pieces")
public class PieceJustificativeController {

    private final PieceJustificativeService pieceService;

    public PieceJustificativeController(PieceJustificativeService pieceService) {
        this.pieceService = pieceService;
    }

    @PostMapping("/upload")
    public ResponseEntity<PieceJustificativeResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam(value = "interventionId", required = false) Long interventionId,
            @RequestParam(value = "devisId", required = false) Long devisId,
            @RequestParam(value = "factureId", required = false) Long factureId) {

        PieceJustificativeResponse response = pieceService.uploadFile(file, type, interventionId, devisId, factureId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PieceJustificativeResponse> getFileMetadata(@PathVariable Long id) {
        PieceJustificativeResponse response = pieceService.getFileMetadata(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        PieceJustificativeResponse metadata = pieceService.getFileMetadata(id);
        Resource resource = pieceService.downloadFile(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + metadata.getOriginalFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/intervention/{interventionId}")
    public ResponseEntity<List<PieceJustificativeResponse>> getFilesByIntervention(
            @PathVariable Long interventionId) {
        List<PieceJustificativeResponse> files = pieceService.getFilesByIntervention(interventionId);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/devis/{devisId}")
    public ResponseEntity<List<PieceJustificativeResponse>> getFilesByDevis(@PathVariable Long devisId) {
        List<PieceJustificativeResponse> files = pieceService.getFilesByDevis(devisId);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/facture/{factureId}")
    public ResponseEntity<List<PieceJustificativeResponse>> getFilesByFacture(@PathVariable Long factureId) {
        List<PieceJustificativeResponse> files = pieceService.getFilesByFacture(factureId);
        return ResponseEntity.ok(files);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        pieceService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }
}
