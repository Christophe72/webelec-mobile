package com.webelec.backend.controller;

import com.webelec.backend.dto.PhotoResponse;
import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Photo;
import com.webelec.backend.repository.ChantierRepository;
import com.webelec.backend.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    private final ChantierRepository chantierRepository;
    private final PhotoRepository photoRepository;

    public PhotoController(ChantierRepository chantierRepository,
                           PhotoRepository photoRepository) {
        this.chantierRepository = chantierRepository;
        this.photoRepository = photoRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("chantierId") Long chantierId) throws IOException {

        Chantier chantier = chantierRepository.findById(chantierId)
                .orElseThrow(() -> new RuntimeException("Chantier introuvable"));

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);

        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        Photo photo = new Photo();
        photo.setFileName(fileName);
        photo.setChantier(chantier);
        photo.setCreatedAt(LocalDateTime.now());

        photoRepository.save(photo);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/chantier/{chantierId}")
    public List<PhotoResponse> getPhotosByChantier(@PathVariable Long chantierId) {
        return photoRepository.findByChantierId(chantierId)
                .stream()
                .map(photo -> new PhotoResponse(
                        photo.getId(),
                        photo.getFileName(),
                        photo.getCreatedAt()
                ))
                .toList();
    }
}
