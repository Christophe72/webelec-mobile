package com.webelec.backend.dto;

import com.webelec.backend.model.StockMouvement;

public class StockMouvementResponse {

    private Long produitId;
    private Integer quantite;
    private String type;
    private String raison;

    public StockMouvementResponse() {}

    private StockMouvementResponse(Long produitId, Integer quantite, String type, String raison) {
        this.produitId = produitId;
        this.quantite = quantite;
        this.type = type;
        this.raison = raison;
    }

    public static StockMouvementResponse from(StockMouvement entity) {
        return new StockMouvementResponse(
                entity.getProduit().getId(),
                entity.getQuantite(),
                entity.getType().getApiValue(),
                entity.getRaison()
        );
    }

    public Long getProduitId() { return produitId; }
    public void setProduitId(Long produitId) { this.produitId = produitId; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRaison() { return raison; }
    public void setRaison(String raison) { this.raison = raison; }
}
