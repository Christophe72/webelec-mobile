package com.webelec.backend.service;

import com.webelec.backend.dto.ClientRequest;
import com.webelec.backend.exception.ConflictException;
import com.webelec.backend.exception.ResourceNotFoundException;
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
import static org.mockito.Mockito.any;

class ClientServiceTest {

    @Mock
    private ClientRepository repository;

    @InjectMocks
    private ClientService service;

    private ClientRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request = buildRequest();
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

        Client actual = service.findById(4L);

        assertThat(actual).isEqualTo(expected);
        verify(repository, times(1)).findById(4L);
    }

    @Test
    @DisplayName("findById absent")
    void testFindByIdNotFound() {
        when(repository.findById(8L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findById(8L));
        verify(repository, times(1)).findById(8L);
    }

    @Test
    @DisplayName("create sauvegarde le client")
    void testCreate() {
        Client saved = buildClient(9L);
        when(repository.save(any(Client.class))).thenReturn(saved);

        Client actual = service.create(request);

        assertThat(actual).isEqualTo(saved);
        verify(repository, times(1)).save(any(Client.class));
    }

    @Test
    @DisplayName("create lève ConflictException si email déjà pris")
    void testCreateConflict() {
        when(repository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(ConflictException.class, () -> service.create(request));
    }

    @Test
    @DisplayName("update recopie les champs")
    void testUpdate() {
        Long id = 6L;
        Client existing = buildClient(id);
        when(repository.findById(id)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        Client updated = service.update(id, request);

        assertThat(updated.getNom()).isEqualTo(request.getNom());
        assertThat(updated.getPrenom()).isEqualTo(request.getPrenom());
        assertThat(updated.getEmail()).isEqualTo(request.getEmail());
        verify(repository, times(1)).save(existing);
    }

    @Test
    @DisplayName("update lève ConflictException si email déjà pris")
    void testUpdateConflict() {
        Long id = 6L;
        Client existing = buildClient(id);
        when(repository.findById(id)).thenReturn(Optional.of(existing));
        Client other = buildClient(10L);
        when(repository.findByEmail(request.getEmail())).thenReturn(other);

        assertThrows(ConflictException.class, () -> service.update(id, request));
    }

    @Test
    @DisplayName("update lève une exception si client inconnu")
    void testUpdateNotFound() {
        when(repository.findById(77L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.update(77L, request));
        verify(repository, times(1)).findById(77L);
    }

    @Test
    @DisplayName("delete supprime via le repository")
    void testDelete() {
        when(repository.existsById(12L)).thenReturn(true);
        doNothing().when(repository).deleteById(12L);

        service.delete(12L);

        verify(repository).existsById(12L);
        ArgumentCaptor<Long> captor = ArgumentCaptor.forClass(Long.class);
        verify(repository).deleteById(captor.capture());
        assertThat(captor.getValue()).isEqualTo(12L);
    }

    @Test
    @DisplayName("delete lève une exception quand client inexistant")
    void testDeleteNotFound() {
        when(repository.existsById(55L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> service.delete(55L));
        verify(repository).existsById(55L);
        verify(repository, times(0)).deleteById(any());
    }

    private ClientRequest buildRequest() {
        ClientRequest req = new ClientRequest();
        req.setNom("Dupont");
        req.setPrenom("Jean");
        req.setEmail("jean@exemple.com");
        req.setTelephone("0470/123456");
        req.setAdresse("Rue test 1");
        req.setSocieteId(1L);
        return req;
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