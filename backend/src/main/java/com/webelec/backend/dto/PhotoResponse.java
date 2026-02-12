package com.webelec.backend.dto;

import java.time.LocalDateTime;

public record PhotoResponse(
        Long id,
        String fileName,
        LocalDateTime createdAt
) {}
