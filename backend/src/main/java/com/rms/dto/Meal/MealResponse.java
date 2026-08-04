package com.rms.dto.Meal;

import com.rms.domain.enums.Status;

import java.time.Instant;
import java.util.List;

public record MealResponse(
        Long id,
        String name,
        String imageUrl,
        Long categoryId,
        Status status,
        String description,
        List<MealVariationResponse> variations,
        List<Long> modifierIds,
        Instant createdAt,
        Instant updatedAt
) {
}
