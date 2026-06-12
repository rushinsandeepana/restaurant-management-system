package com.rms.controller;

import com.rms.dto.CreateMealRequest;
import com.rms.dto.MealResponse;
import com.rms.service.MealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    @GetMapping
    @PreAuthorize("hasAnyRole('CASHIER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<Page<MealResponse>> getMeals(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(mealService.findMeals(search, pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CASHIER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<MealResponse> createMeal(@Valid @RequestBody CreateMealRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mealService.createMeal(request));
    }
}
