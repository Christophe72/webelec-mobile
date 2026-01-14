package com.webelec.backend.service;

import com.webelec.backend.dto.StockMouvementRequest;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Produit;
import com.webelec.backend.model.StockMouvement;
import com.webelec.backend.model.StockMouvementType;
import com.webelec.backend.repository.ProduitRepository;
import com.webelec.backend.repository.StockMouvementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StockService {

    private final ProduitRepository produitRepository;
    private final StockMouvementRepository stockMouvementRepository;

    public StockService(ProduitRepository produitRepository,
                        StockMouvementRepository stockMouvementRepository) {
        this.produitRepository = produitRepository;
        this.stockMouvementRepository = stockMouvementRepository;
    }

    @Transactional
    public StockMouvement enregistrerMouvement(StockMouvementRequest request) {
        Produit produit = produitRepository.findById(request.getProduitId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));

        StockMouvementType type = StockMouvementType.fromApi(request.getType());
        int quantite = request.getQuantite();
        int stockActuel = produit.getQuantiteStock() != null ? produit.getQuantiteStock() : 0;
        int delta = type == StockMouvementType.IN ? quantite : -quantite;
        int nouveauStock = stockActuel + delta;

        if (nouveauStock < 0) {
            throw new IllegalArgumentException("Stock insuffisant pour effectuer ce mouvement");
        }

        produit.setQuantiteStock(nouveauStock);

        StockMouvement mouvement = new StockMouvement();
        mouvement.setProduit(produit);
        mouvement.setQuantite(quantite);
        mouvement.setType(type);
        mouvement.setRaison(request.getRaison());

        stockMouvementRepository.save(mouvement);
        produitRepository.save(produit);

        return mouvement;
    }
}
