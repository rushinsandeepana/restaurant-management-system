package com.rms.mapper;

import com.rms.domain.Meal;
import com.rms.domain.MealVariation;
import com.rms.domain.Modifier;
import com.rms.dto.Meal.MealResponse;
import com.rms.dto.Meal.MealVariationResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MealMapper {

    public MealResponse toResponse(Meal meal) {
        List<MealVariationResponse> variations = meal.getVariations() == null
                ? List.of()
                : meal.getVariations().stream()
                        .map(this::toVariationResponse)
                        .toList();

        @SuppressWarnings("null")
        List<Long> modifierIds = meal.getModifiers() == null
                ? List.of()
                : meal.getModifiers().stream()
                        .map(Modifier::getId)
                        .toList();

        return new MealResponse(
                meal.getId(),
                meal.getName(),
                meal.getImageUrl(),
                meal.getCategory() != null ? meal.getCategory().getId() : null,
                meal.getStatus(),
                meal.getDescription(),
                variations,
                modifierIds,
                meal.getCreatedAt(),
                meal.getUpdatedAt()
        );
    }

    private MealVariationResponse toVariationResponse(MealVariation variation) {
        return new MealVariationResponse(
                variation.getId(),
                variation.getName(),
                variation.getPrice(),
                variation.getStatus()
        );
    }
}
