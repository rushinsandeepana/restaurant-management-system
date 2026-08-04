package com.rms.dto.Meal;

import com.rms.domain.enums.Status;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record MealVariationRequest(
        @NotBlank(message = "Variation name is required") String name,
        @NotNull(message = "Variation price is required") @DecimalMin(value = "0.0", inclusive = true, message = "Variation price must be at least 0") BigDecimal price,
        @NotNull(message = "Variation status is required") Status status
) {
}
