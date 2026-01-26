package com.webelec.backend.dto;

import jakarta.validation.constraints.NotNull;

public record UserSelectionRequest(@NotNull Long societeId) { }
