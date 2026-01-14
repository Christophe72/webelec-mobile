package com.webelec.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class StockMouvementRequest {

    @NotNull(message = "Le produit est obligatoire")
    private Long produitId;

    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 1, message = "La quantité doit être positive")
    private Integer quantite;

    @NotBlank(message = "Le type de mouvement est obligatoire")
    @Pattern(regexp = "(?i)in|out", message = "Le type doit être 'in' ou 'out'")
    private String type;

    @Size(max = 255, message = "La raison ne peut dépasser 255 caractères")
    private String raison;

    public Long getProduitId() { return produitId; }
    public void setProduitId(Long produitId) { this.produitId = produitId; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRaison() { return raison; }
    public void setRaison(String raison) { this.raison = raison; }
}
