package com.rms.dto;

import java.math.BigDecimal;

public record MealVariationResponse(
        Long id,
        String name,
        BigDecimal priceAdjustment,
        BigDecimal totalPrice
) {
}
