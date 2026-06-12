package com.rms.service;

import com.rms.domain.Meal;
import com.rms.domain.MealVariation;
import com.rms.dto.CreateMealRequest;
import com.rms.dto.MealResponse;
import com.rms.dto.MealVariationRequest;
import com.rms.mapper.MealMapper;
import com.rms.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final MealMapper mealMapper;

    @Transactional(readOnly = true)
    public Page<MealResponse> findMeals(String search, Pageable pageable) {
        String term = search == null ? "" : search.trim();
        return mealRepository.findAllWithSearch(term, pageable).map(mealMapper::toResponse);
    }

    @Transactional
    public MealResponse createMeal(CreateMealRequest request) {
        Meal meal = Meal.builder()
                .name(request.name().trim())
                .imageUrl(request.imageUrl() != null ? request.imageUrl().trim() : null)
                .quantity(request.quantity())
                .basePrice(request.basePrice())
                .build();

        List<MealVariationRequest> variationRequests =
                request.variations() != null ? request.variations() : Collections.emptyList();

        List<MealVariation> variations = variationRequests.stream()
                .map(v -> MealVariation.builder()
                        .name(v.name().trim())
                        .priceAdjustment(v.priceAdjustment())
                        .build())
                .toList();

        meal.setVariations(variations);
        return mealMapper.toResponse(mealRepository.save(meal));
    }
}
