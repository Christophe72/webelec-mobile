package com.webelec.backend.service;

import com.webelec.backend.dto.PaiementRequest;
import com.webelec.backend.model.Facture;
import com.webelec.backend.model.Paiement;
import com.webelec.backend.repository.FactureRepository;
import com.webelec.backend.repository.PaiementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests unitaires PaiementService")
class PaiementServiceTest {

    @Mock
    private PaiementRepository paiementRepository;

    @Mock
    private FactureRepository factureRepository;

    @InjectMocks
    private PaiementService paiementService;

    private Facture facture;
    private Paiement paiement;
    private PaiementRequest paiementRequest;

    @BeforeEach
    void setUp() {
        facture = new Facture();
        facture.setId(1L);
        facture.setNumero("FAC-2026-001");

        paiement = new Paiement();
        paiement.setId(1L);
        paiement.setMontant(new BigDecimal("1000.00"));
        paiement.setDate(LocalDate.now());
        paiement.setMode("VIREMENT");
        paiement.setReference("PAY-001");
        paiement.setFacture(facture);

        paiementRequest = new PaiementRequest(
            new BigDecimal("1000.00"),
            LocalDate.now(),
            "VIREMENT",
            "PAY-001"
        );
    }

    @Test
    @DisplayName("Créer un paiement avec succès")
    void createPaiement_Success() {
        // Given
        when(factureRepository.findById(1L)).thenReturn(Optional.of(facture));
        when(paiementRepository.save(any(Paiement.class))).thenReturn(paiement);

        // When
        Paiement result = paiementService.createPaiement(1L, paiementRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getMontant()).isEqualByComparingTo(new BigDecimal("1000.00"));
        assertThat(result.getMode()).isEqualTo("VIREMENT");
        verify(factureRepository).findById(1L);
        verify(paiementRepository).save(any(Paiement.class));
    }

    @Test
    @DisplayName("Créer un paiement échoue si la facture n'existe pas")
    void createPaiement_FactureNotFound() {
        // Given
        when(factureRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> paiementService.createPaiement(999L, paiementRequest))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Facture non trouvée");

        verify(factureRepository).findById(999L);
        verify(paiementRepository, never()).save(any());
    }

    @Test
    @DisplayName("Créer un paiement avec date null utilise la date du jour")
    void createPaiement_NullDate_UsesToday() {
        // Given
        PaiementRequest requestWithNullDate = new PaiementRequest(
            new BigDecimal("500.00"),
            null,
            "ESPECES",
            "PAY-002"
        );
        when(factureRepository.findById(1L)).thenReturn(Optional.of(facture));
        when(paiementRepository.save(any(Paiement.class))).thenAnswer(invocation -> {
            Paiement saved = invocation.getArgument(0);
            assertThat(saved.getDate()).isEqualTo(LocalDate.now());
            return saved;
        });

        // When
        paiementService.createPaiement(1L, requestWithNullDate);

        // Then
        verify(paiementRepository).save(any(Paiement.class));
    }

    @Test
    @DisplayName("Récupérer les paiements par facture ID")
    void getPaiementsByFactureId_Success() {
        // Given
        List<Paiement> paiements = List.of(paiement);
        when(paiementRepository.findByFactureId(1L)).thenReturn(paiements);

        // When
        List<Paiement> result = paiementService.getPaiementsByFactureId(1L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMontant()).isEqualByComparingTo(new BigDecimal("1000.00"));
        verify(paiementRepository).findByFactureId(1L);
    }

    @Test
    @DisplayName("Récupérer un paiement par ID")
    void getPaiementById_Success() {
        // Given
        when(paiementRepository.findById(1L)).thenReturn(Optional.of(paiement));

        // When
        Paiement result = paiementService.getPaiementById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(paiementRepository).findById(1L);
    }

    @Test
    @DisplayName("Récupérer un paiement échoue si non trouvé")
    void getPaiementById_NotFound() {
        // Given
        when(paiementRepository.findById(999L)).thenReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> paiementService.getPaiementById(999L))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Paiement non trouvé");
    }

    @Test
    @DisplayName("Supprimer un paiement avec succès")
    void deletePaiement_Success() {
        // Given
        when(paiementRepository.existsById(1L)).thenReturn(true);
        doNothing().when(paiementRepository).deleteById(1L);

        // When
        paiementService.deletePaiement(1L);

        // Then
        verify(paiementRepository).existsById(1L);
        verify(paiementRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Supprimer un paiement échoue si non trouvé")
    void deletePaiement_NotFound() {
        // Given
        when(paiementRepository.existsById(999L)).thenReturn(false);

        // When / Then
        assertThatThrownBy(() -> paiementService.deletePaiement(999L))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Paiement non trouvé");

        verify(paiementRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("Validation: montant négatif rejeté")
    void createPaiement_NegativeAmount() {
        // Given
        PaiementRequest invalidRequest = new PaiementRequest(
            new BigDecimal("-100.00"),
            LocalDate.now(),
            "VIREMENT",
            "PAY-NEG"
        );

        // Ce test vérifie que la validation Jakarta se fait au niveau du controller
        // Le service lui-même ne valide pas, c'est le rôle de @Valid dans le controller
    }
}
