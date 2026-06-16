package com.rms.mapper;

import com.rms.domain.Category;
import com.rms.dto.Category.CategoryResponse;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getStatus(),
                category.getImageUrl(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}