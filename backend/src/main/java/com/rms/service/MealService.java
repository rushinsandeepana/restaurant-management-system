package com.rms.service;

import com.rms.domain.Category;
import com.rms.domain.Meal;
import com.rms.domain.MealVariation;
import com.rms.domain.Modifier;
import com.rms.dto.Meal.CreateMealRequest;
import com.rms.dto.Meal.MealResponse;
import com.rms.dto.Meal.MealVariationRequest;
import com.rms.dto.Meal.UpdateMealRequest;
import com.rms.mapper.MealMapper;
import com.rms.repository.CategoryRepository;
import com.rms.repository.MealRepository;
import com.rms.repository.ModifierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final CategoryRepository categoryRepository;
    private final ModifierRepository modifierRepository;
    private final MealMapper mealMapper;

    @SuppressWarnings("null")
    @Transactional(readOnly = true)
    public Page<MealResponse> findMeals(String search, Pageable pageable) {

        String term = search == null ? "" : search.trim();

        Page<Meal> meals =
                mealRepository.findAllWithSearch(term, pageable);

        List<Long> mealIds = meals.getContent()
                .stream()
                .map(Meal::getId)
                .toList();

        if (!mealIds.isEmpty()) {
            mealRepository.findMealsWithModifiers(mealIds);
        }

        return meals.map(mealMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public MealResponse findById(Long id) {
        return mealMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public MealResponse createMeal(CreateMealRequest request) {
        @SuppressWarnings("null")
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));

        Meal meal = Meal.builder()
                .name(request.name().trim())
                .imageUrl(request.imageUrl() != null ? request.imageUrl().trim() : null)
                .category(category)
                .status(request.status())
                .description(request.description() != null ? request.description().trim() : null)
                .build();

        meal.setVariations(toVariations(request.variations()));
        meal.setModifiers(resolveModifiers(request.modifierIds()));

        return mealMapper.toResponse(mealRepository.save(meal));
    }

    @SuppressWarnings("null")
    @Transactional
    public MealResponse updateMeal(Long id, UpdateMealRequest request) {
        Meal meal = getOrThrow(id);
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));

        meal.setName(request.name().trim());
        meal.setImageUrl(request.imageUrl() != null ? request.imageUrl().trim() : null);
        meal.setCategory(category);
        meal.setStatus(request.status());
        meal.setDescription(request.description() != null ? request.description().trim() : null);
        meal.setVariations(toVariations(request.variations()));
        meal.setModifiers(resolveModifiers(request.modifierIds()));

        return mealMapper.toResponse(mealRepository.save(meal));
    }

    @SuppressWarnings("null")
    @Transactional
    public void deleteMeal(Long id) {
        if (!mealRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Meal not found with id: " + id);
        }
        mealRepository.deleteById(id);
    }

    private List<MealVariation> toVariations(List<MealVariationRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return Collections.emptyList();
        }

        return requests.stream()
                .map(v -> MealVariation.builder()
                        .name(v.name().trim())
                        .price(v.price())
                        .status(v.status())
                        .build())
                .toList();
    }

    private Set<Modifier> resolveModifiers(List<Long> modifierIds) {
        if (modifierIds == null || modifierIds.isEmpty()) {
            return new HashSet<>();
        }

        Set<Modifier> modifiers = new HashSet<>(modifierRepository.findAllById(modifierIds));
        if (modifiers.size() != new HashSet<>(modifierIds).size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more modifiers were not found");
        }

        return modifiers;
    }

    @SuppressWarnings("null")
    private Meal getOrThrow(Long id) {
        return mealRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meal not found with id: " + id));
    }
}
