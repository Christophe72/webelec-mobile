package com.webelec.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webelec.backend.dto.ClientRequest;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import com.webelec.backend.service.ClientService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClientController.class)
class ClientControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private ClientService service;

    @Test
    void createClient_success() throws Exception {
        ClientRequest req = new ClientRequest();
        req.setNom("Martin");
        req.setPrenom("Lucie");
        req.setEmail("lucie@test.com");
        req.setTelephone("0488/000000");
        req.setAdresse("Rue neuve 10");
        req.setSocieteId(2L);
        Client client = Client.builder().id(1L).nom("Martin").prenom("Lucie").email("lucie@test.com").telephone("0488/000000").adresse("Rue neuve 10").societe(Societe.builder().id(2L).build()).build();
        Mockito.when(service.create(any(Client.class))).thenReturn(client);
        mockMvc.perform(post("/api/clients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nom").value("Martin"));
    }

    @Test
    void createClient_invalidJson_returns400() throws Exception {
        String invalidJson = "{\"nom\":\"\",\"email\":\"not-an-email\"}";
        mockMvc.perform(post("/api/clients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateClient_success() throws Exception {
        ClientRequest req = new ClientRequest();
        req.setNom("Martin");
        req.setPrenom("Lucie");
        req.setEmail("lucie@test.com");
        req.setTelephone("0488/000000");
        req.setAdresse("Rue neuve 10");
        req.setSocieteId(2L);
        Client client = Client.builder().id(1L).nom("Martin").prenom("Lucie").email("lucie@test.com").telephone("0488/000000").adresse("Rue neuve 10").societe(Societe.builder().id(2L).build()).build();
        Mockito.when(service.update(Mockito.eq(1L), any(Client.class))).thenReturn(client);
        mockMvc.perform(put("/api/clients/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nom").value("Martin"));
    }

    @Test
    void deleteClient_success() throws Exception {
        Mockito.doNothing().when(service).delete(1L);
        mockMvc.perform(delete("/api/clients/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void createClient_conflict_returns409() throws Exception {
        ClientRequest req = new ClientRequest();
        req.setNom("Martin");
        req.setPrenom("Lucie");
        req.setEmail("lucie@test.com");
        req.setTelephone("0488/000000");
        req.setAdresse("Rue neuve 10");
        req.setSocieteId(2L);
        Mockito.when(service.create(any(Client.class))).thenThrow(new IllegalStateException("Email déjà utilisé"));
        mockMvc.perform(post("/api/clients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(content().string("Email déjà utilisé"));
    }
}