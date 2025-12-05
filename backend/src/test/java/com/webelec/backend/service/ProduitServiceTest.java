package com.webelec.backend.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Produit;
import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.ProduitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProduitServiceTest {

    @Mock
    private ProduitRepository repository;

    @InjectMocks
    private ProduitService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("findAll doit renvoyer tous les produits")
    void testFindAll() {
        List<Produit> expected = Arrays.asList(buildProduit(1L), buildProduit(2L));
        when(repository.findAll()).thenReturn(expected);

        List<Produit> actual = service.findAll();

        assertThat(actual).isEqualTo(expected);
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("findBySociete doit filtrer par société")
    void testFindBySociete() {
        Long societeId = 5L;
        List<Produit> expected = List.of(buildProduit(3L));
        when(repository.findBySocieteId(societeId)).thenReturn(expected);

        List<Produit> actual = service.findBySociete(societeId);

        assertThat(actual).isEqualTo(expected);
        verify(repository, times(1)).findBySocieteId(societeId);
    }

    @Test
    @DisplayName("findById doit renvoyer le produit lorsqu'il existe")
    void testFindByIdFound() {
        Produit produit = buildProduit(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(produit));

        Optional<Produit> actual = service.findById(1L);

        assertThat(actual).contains(produit);
        verify(repository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("findById doit renvoyer vide quand le produit est absent")
    void testFindByIdNotFound() {
        when(repository.findById(9L)).thenReturn(Optional.empty());

        Optional<Produit> actual = service.findById(9L);

        assertThat(actual).isEmpty();
        verify(repository, times(1)).findById(9L);
    }

    @Test
    @DisplayName("create doit sauvegarder et renvoyer le produit")
    void testCreate() {
        Produit input = buildProduit(null);
        Produit saved = buildProduit(4L);
        when(repository.save(input)).thenReturn(saved);

        Produit actual = service.create(input);

        assertThat(actual).isEqualTo(saved);
        verify(repository, times(1)).save(input);
    }

    @Test
    @DisplayName("update doit recopier les valeurs et sauvegarder")
    void testUpdate() {
        Long id = 10L;
        Produit existing = buildProduit(id);
        Produit payload = Produit.builder()
                .reference("REF-NEW")
                .nom("Nouveau nom")
                .description("Desc mise à jour")
                .quantiteStock(50)
                .prixUnitaire(BigDecimal.valueOf(199.99))
                .societe(Societe.builder().id(2L).nom("Societe B").build())
                .build();

        when(repository.findById(id)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        Produit updated = service.update(id, payload);

        assertThat(updated.getReference()).isEqualTo("REF-NEW");
        assertThat(updated.getNom()).isEqualTo("Nouveau nom");
        assertThat(updated.getDescription()).isEqualTo("Desc mise à jour");
        assertThat(updated.getQuantiteStock()).isEqualTo(50);
        assertThat(updated.getPrixUnitaire()).isEqualTo(BigDecimal.valueOf(199.99));
        assertThat(updated.getSociete().getId()).isEqualTo(2L);
        verify(repository, times(1)).save(existing);
    }

    @Test
    @DisplayName("update doit lever une exception si le produit n'existe pas")
    void testUpdateNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.update(99L, buildProduit(null)));
        verify(repository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("delete doit déléguer au repository")
    void testDelete() {
        when(repository.existsById(7L)).thenReturn(true);
        doNothing().when(repository).deleteById(7L);

        service.delete(7L);

        verify(repository).existsById(7L);
        ArgumentCaptor<Long> captor = ArgumentCaptor.forClass(Long.class);
        verify(repository).deleteById(captor.capture());
        assertThat(captor.getValue()).isEqualTo(7L);
    }

    @Test
    @DisplayName("delete doit lever une exception si le produit n'existe pas")
    void testDeleteNotFound() {
        when(repository.existsById(88L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> service.delete(88L));
        verify(repository).existsById(88L);
        verify(repository, times(0)).deleteById(any());
    }

    private Produit buildProduit(Long id) {
        return Produit.builder()
                .id(id)
                .reference(id == null ? "REF" : "REF-" + id)
                .nom(id == null ? "Produit" : "Produit " + id)
                .description("Description")
                .quantiteStock(10)
                .prixUnitaire(BigDecimal.TEN)
                .societe(Societe.builder().id(1L).nom("Societe A").build())
                .build();
    }
}