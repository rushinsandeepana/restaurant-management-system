package com.rms.controller;

import com.rms.dto.Category.CategoryResponse;
import com.rms.dto.Category.CreateCategoryRequest;
import com.rms.service.CategoryService;
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
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<Page<CategoryResponse>> getCategories(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(categoryService.findCategories(search, pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request));
    }
}