package com.rms.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record MealResponse(
        Long id,
        String name,
        String imageUrl,
        int quantity,
        BigDecimal basePrice,
        BigDecimal totalPrice,
        List<MealVariationResponse> variations,
        Instant createdAt
) {
}
