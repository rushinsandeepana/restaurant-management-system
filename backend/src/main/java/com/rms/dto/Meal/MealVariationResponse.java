package com.rms.dto.Meal;

import com.rms.domain.enums.Status;

import java.math.BigDecimal;

public record MealVariationResponse(
        Long id,
        String name,
        BigDecimal price,
        Status status
) {
}
