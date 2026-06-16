package com.rms.service;

import com.rms.domain.Category;
import com.rms.dto.Category.CategoryResponse;
import com.rms.dto.Category.CreateCategoryRequest;
import com.rms.mapper.CategoryMapper;
import com.rms.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public Page<CategoryResponse> findCategories(String search, Pageable pageable) {
        String term = search == null ? "" : search.trim();
        return categoryRepository.findAllWithSearch(term, pageable)
                .map(categoryMapper::toResponse);
    }

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        // Validate slug uniqueness
        if (categoryRepository.existsBySlug(request.slug())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Slug '" + request.slug() + "' is already in use"
            );
        }

        Category category = Category.builder()
                .name(request.name().trim())
                .slug(request.slug().trim())
                .description(request.description() != null ? request.description().trim() : null)
                .status(request.status())
                .imageUrl(request.imageUrl() != null ? request.imageUrl().trim() : null)
                .build();

        return categoryMapper.toResponse(categoryRepository.save(category));
    }
}