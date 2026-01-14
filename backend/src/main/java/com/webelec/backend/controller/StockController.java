package com.webelec.backend.controller;

import com.webelec.backend.dto.StockMouvementRequest;
import com.webelec.backend.dto.StockMouvementResponse;
import com.webelec.backend.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    @PostMapping("/mouvements")
    public ResponseEntity<StockMouvementResponse> create(@Valid @RequestBody StockMouvementRequest request) {
        var mouvement = service.enregistrerMouvement(request);
        return ResponseEntity.ok(StockMouvementResponse.from(mouvement));
    }
}
