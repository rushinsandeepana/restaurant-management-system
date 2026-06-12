package com.rms.mapper;

import com.rms.domain.Meal;
import com.rms.domain.MealVariation;
import com.rms.dto.MealResponse;
import com.rms.dto.MealVariationResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Component
public class MealMapper {

    public MealResponse toResponse(Meal meal) {
        List<MealVariationResponse> variations = meal.getVariations().stream()
                .map(v -> toVariationResponse(meal.getBasePrice(), v))
                .toList();

        return new MealResponse(
                meal.getId(),
                meal.getName(),
                meal.getImageUrl(),
                meal.getQuantity(),
                meal.getBasePrice(),
                computeTotalPrice(meal.getBasePrice(), meal.getVariations()),
                variations,
                meal.getCreatedAt()
        );
    }

    private MealVariationResponse toVariationResponse(BigDecimal basePrice, MealVariation variation) {
        return new MealVariationResponse(
                variation.getId(),
                variation.getName(),
                variation.getPriceAdjustment(),
                basePrice.add(variation.getPriceAdjustment())
        );
    }

    private BigDecimal computeTotalPrice(BigDecimal basePrice, List<MealVariation> variations) {
        if (variations == null || variations.isEmpty()) {
            return basePrice;
        }
        BigDecimal maxAdjustment = variations.stream()
                .map(MealVariation::getPriceAdjustment)
                .max(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);
        return basePrice.add(maxAdjustment);
    }
}
