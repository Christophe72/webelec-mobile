package com.webelec.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AuthRegisterRequest(
        @NotBlank @Size(max = 255) String nom,
        @NotBlank @Size(max = 255) String prenom,
        @Email @NotBlank @Size(max = 255) String email,
        @NotBlank @Size(min = 6, max = 255) String motDePasse,
        @NotBlank String role,
        @NotNull Long societeId
) {}
