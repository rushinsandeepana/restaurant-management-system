package com.rms.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreateMealRequest(
        @NotBlank String name,
        String imageUrl,
        @NotNull @Min(0) Integer quantity,
        @NotNull @DecimalMin("0.0") BigDecimal basePrice,
        @Valid List<MealVariationRequest> variations
) {
}
