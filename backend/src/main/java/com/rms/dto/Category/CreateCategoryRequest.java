package com.rms.dto.Category;

import com.rms.domain.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCategoryRequest(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Slug is required")
        String slug,

        String description,

        @NotNull(message = "Status is required")
        Status status,

        String imageUrl
) {}