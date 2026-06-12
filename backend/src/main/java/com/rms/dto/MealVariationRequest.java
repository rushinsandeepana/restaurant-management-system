package com.rms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record MealVariationRequest(
        @NotBlank String name,
        @NotNull BigDecimal priceAdjustment
) {
}
