package com.webelec.backend.service;

import com.webelec.backend.dto.PieceJustificativeResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.*;
import com.webelec.backend.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PieceJustificativeService {

    private final PieceJustificativeRepository pieceRepository;
    private final InterventionRepository interventionRepository;
    private final DevisRepository devisRepository;
    private final FactureRepository factureRepository;
    private final Path fileStorageLocation;

    public PieceJustificativeService(
            PieceJustificativeRepository pieceRepository,
            InterventionRepository interventionRepository,
            DevisRepository devisRepository,
            FactureRepository factureRepository,
            @Value("${app.file.upload-dir:uploads}") String uploadDir) {
        this.pieceRepository = pieceRepository;
        this.interventionRepository = interventionRepository;
        this.devisRepository = devisRepository;
        this.factureRepository = factureRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public PieceJustificativeResponse uploadFile(MultipartFile file, String type,
                                                  Long interventionId, Long devisId, Long factureId) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = UUID.randomUUID().toString() + fileExtension;
        
        try {
            Path targetLocation = this.fileStorageLocation.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            PieceJustificative piece = new PieceJustificative();
            piece.setFilename(filename);
            piece.setOriginalFilename(originalFilename);
            piece.setContentType(file.getContentType());
            piece.setFileSize(file.getSize());
            piece.setType(type);
            piece.setFilePath(targetLocation.toString());
            piece.setUploadDate(LocalDateTime.now());

            if (interventionId != null) {
                Intervention intervention = interventionRepository.findById(interventionId)
                        .orElseThrow(() -> new ResourceNotFoundException("Intervention not found with id: " + interventionId));
                piece.setIntervention(intervention);
            }

            if (devisId != null) {
                Devis devis = devisRepository.findById(devisId)
                        .orElseThrow(() -> new ResourceNotFoundException("Devis not found with id: " + devisId));
                piece.setDevis(devis);
            }

            if (factureId != null) {
                Facture facture = factureRepository.findById(factureId)
                        .orElseThrow(() -> new ResourceNotFoundException("Facture not found with id: " + factureId));
                piece.setFacture(facture);
            }

            piece = pieceRepository.save(piece);
            return toResponse(piece);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + filename + ". Please try again!", ex);
        }
    }

    public Resource downloadFile(Long id) {
        PieceJustificative piece = pieceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + id));

        try {
            Path filePath = Paths.get(piece.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + piece.getFilename());
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found: " + piece.getFilename());
        }
    }

    public PieceJustificativeResponse getFileMetadata(Long id) {
        PieceJustificative piece = pieceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + id));
        return toResponse(piece);
    }

    public List<PieceJustificativeResponse> getFilesByIntervention(Long interventionId) {
        return pieceRepository.findByInterventionId(interventionId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PieceJustificativeResponse> getFilesByDevis(Long devisId) {
        return pieceRepository.findByDevisId(devisId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PieceJustificativeResponse> getFilesByFacture(Long factureId) {
        return pieceRepository
        		.findByFactureId(factureId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteFile(Long id) {
        PieceJustificative piece = pieceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + id));

        try {
            Path filePath = Paths.get(piece.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            // Log the error but continue with database deletion
            System.err.println("Could not delete file: " + piece.getFilePath());
        }

        pieceRepository.delete(piece);
    }

    private PieceJustificativeResponse toResponse(PieceJustificative piece) {
        PieceJustificativeResponse response = new PieceJustificativeResponse();
        response.setId(piece.getId());
        response.setFilename(piece.getFilename());
        response.setOriginalFilename(piece.getOriginalFilename());
        response.setContentType(piece.getContentType());
        response.setFileSize(piece.getFileSize());
        response.setType(piece.getType());
        response.setDownloadUrl("/api/pieces/" + piece.getId() + "/download");
        response.setUploadDate(piece.getUploadDate());

        if (piece.getIntervention() != null) {
            response.setInterventionId(piece.getIntervention().getId());
        }
        if (piece.getDevis() != null) {
            response.setDevisId(piece.getDevis().getId());
        }
        if (piece.getFacture() != null) {
            response.setFactureId(piece.getFacture().getId());
        }

        return response;
    }
}
