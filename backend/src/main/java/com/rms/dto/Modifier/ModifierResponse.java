package com.rms.dto.Modifier;

import com.rms.domain.enums.Status;

import java.time.Instant;

public record ModifierResponse(
        Long id,
        String name,
        String slug,
        Status status,
        Float base_price,
        Instant createdAt,
        Instant updatedAt
) {
}