package com.rms.dto.Modifier;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rms.domain.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateModifierRequest(

    @NotBlank(message = "Name is required")
    String name,

    @NotBlank(message = "Slug is required")
    String slug,

    @JsonProperty("base_price")
    @NotNull(message = "Base price is required.")
    Float basePrice,

    @NotNull(message = "Status is required")
    Status status

) {}