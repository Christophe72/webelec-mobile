package com.webelec.backend.service;

import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.SocieteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class SocieteServiceTest {

    @Mock
    private SocieteRepository repository;

    @InjectMocks
    private SocieteService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("findAll should return all societes")
    void testFindAll() {
        // Arrange
        List<Societe> expectedSocietes = Arrays.asList(
                Societe.builder().id(1L).nom("Societe 1").tva("TVA1").email("email1@example.com").build(),
                Societe.builder().id(2L).nom("Societe 2").tva("TVA2").email("email2@example.com").build()
        );

        when(repository.findAll()).thenReturn(expectedSocietes);

        // Act
        List<Societe> actualSocietes = service.findAll();

        // Assert
        assertThat(actualSocietes).isEqualTo(expectedSocietes);
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("findById should return the societe when found")
    void testFindByIdFound() {
        // Arrange
        Long societeId = 1L;
        Societe expectedSociete = Societe.builder().id(societeId).nom("Societe 1").build();
        when(repository.findById(societeId)).thenReturn(Optional.of(expectedSociete));

        // Act
        Optional<Societe> actualSociete = service.findById(societeId);

        // Assert
        assertThat(actualSociete).isPresent().contains(expectedSociete);
        verify(repository, times(1)).findById(societeId);
    }

    @Test
    @DisplayName("findById should return empty when societe not found")
    void testFindByIdNotFound() {
        // Arrange
        Long societeId = 1L;
        when(repository.findById(societeId)).thenReturn(Optional.empty());

        // Act
        Optional<Societe> actualSociete = service.findById(societeId);

        // Assert
        assertThat(actualSociete).isEmpty();
        verify(repository, times(1)).findById(societeId);
    }

    @Test
    @DisplayName("create should save and return the societe")
    void testCreate() {
        // Arrange
        Societe societeToCreate = Societe.builder().nom("New Societe").tva("TVANew").email("new@example.com").build();
        Societe expectedSociete = Societe.builder().id(1L).nom("New Societe").tva("TVANew").email("new@example.com").build();
        when(repository.save(societeToCreate)).thenReturn(expectedSociete);

        // Act
        Societe actualSociete = service.create(societeToCreate);

        // Assert
        assertThat(actualSociete).isEqualTo(expectedSociete);
        verify(repository, times(1)).save(societeToCreate);
    }

    @Test
    @DisplayName("delete should call repository deleteById")
    void testDelete() {
        // Arrange
        Long societeId = 1L;
        doNothing().when(repository).deleteById(societeId);

        // Act
        service.delete(societeId);

        // Assert
        ArgumentCaptor<Long> captor = ArgumentCaptor.forClass(Long.class);
        verify(repository, times(1)).deleteById(captor.capture());
        assertThat(captor.getValue()).isEqualTo(societeId);
    }
}
