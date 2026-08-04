package com.rms.dto.Meal;

import com.rms.domain.enums.Status;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UpdateMealRequest(
        @NotBlank(message = "Meal name is required") String name,
        String imageUrl,
        @NotNull(message = "Category is required") Long categoryId,
        @NotNull(message = "Status is required") Status status,
        String description,
        @Valid List<MealVariationRequest> variations,
        List<Long> modifierIds
) {
}
