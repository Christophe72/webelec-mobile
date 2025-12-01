package com.webelec.backend.service;

import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ClientServiceTest {

    @Mock
    private ClientRepository repository;

    @InjectMocks
    private ClientService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("findAll renvoie tous les clients")
    void testFindAll() {
        List<Client> expected = List.of(buildClient(1L), buildClient(2L));
        when(repository.findAll()).thenReturn(expected);

        List<Client> actual = service.findAll();

        assertThat(actual).isEqualTo(expected);
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("findBySociete filtre par société")
    void testFindBySociete() {
        Long societeId = 3L;
        List<Client> expected = List.of(buildClient(5L));
        when(repository.findBySocieteId(societeId)).thenReturn(expected);

        List<Client> actual = service.findBySociete(societeId);

        assertThat(actual).isEqualTo(expected);
        verify(repository, times(1)).findBySocieteId(societeId);
    }

    @Test
    @DisplayName("findById présent")
    void testFindByIdFound() {
        Client expected = buildClient(4L);
        when(repository.findById(4L)).thenReturn(Optional.of(expected));

        Optional<Client> actual = service.findById(4L);

        assertThat(actual).contains(expected);
        verify(repository, times(1)).findById(4L);
    }

    @Test
    @DisplayName("findById absent")
    void testFindByIdNotFound() {
        when(repository.findById(8L)).thenReturn(Optional.empty());

        Optional<Client> actual = service.findById(8L);

        assertThat(actual).isEmpty();
        verify(repository, times(1)).findById(8L);
    }

    @Test
    @DisplayName("create sauvegarde le client")
    void testCreate() {
        Client input = buildClient(null);
        Client saved = buildClient(9L);
        when(repository.save(input)).thenReturn(saved);

        Client actual = service.create(input);

        assertThat(actual).isEqualTo(saved);
        verify(repository, times(1)).save(input);
    }

    @Test
    @DisplayName("update recopie les champs")
    void testUpdate() {
        Long id = 6L;
        Client existing = buildClient(id);
        Client payload = Client.builder()
                .nom("Martin")
                .prenom("Lucie")
                .email("lucie@test.com")
                .telephone("0488/000000")
                .adresse("Rue neuve 10")
                .societe(Societe.builder().id(2L).nom("Societe B").build())
                .build();

        when(repository.findById(id)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        Client updated = service.update(id, payload);

        assertThat(updated.getNom()).isEqualTo("Martin");
        assertThat(updated.getPrenom()).isEqualTo("Lucie");
        assertThat(updated.getEmail()).isEqualTo("lucie@test.com");
        assertThat(updated.getTelephone()).isEqualTo("0488/000000");
        assertThat(updated.getAdresse()).isEqualTo("Rue neuve 10");
        assertThat(updated.getSociete().getId()).isEqualTo(2L);
        verify(repository, times(1)).save(existing);
    }

    @Test
    @DisplayName("update lève une exception si client inconnu")
    void testUpdateNotFound() {
        when(repository.findById(77L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.update(77L, buildClient(null)));
        verify(repository, times(1)).findById(77L);
    }

    @Test
    @DisplayName("delete supprime via le repository")
    void testDelete() {
        doNothing().when(repository).deleteById(12L);

        service.delete(12L);

        ArgumentCaptor<Long> captor = ArgumentCaptor.forClass(Long.class);
        verify(repository, times(1)).deleteById(captor.capture());
        assertThat(captor.getValue()).isEqualTo(12L);
    }

    private Client buildClient(Long id) {
        return Client.builder()
                .id(id)
                .nom(id == null ? "Dupont" : "Dupont " + id)
                .prenom("Jean")
                .email("jean@exemple.com")
                .telephone("0470/123456")
                .adresse("Rue test 1")
                .societe(Societe.builder().id(1L).nom("Societe A").build())
                .build();
    }
}
