package com.rms.dto.Category;

import com.rms.domain.enums.Status;

import java.time.Instant;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String description,
        Status status,
        String imageUrl,
        Instant createdAt,
        Instant updatedAt
) {}