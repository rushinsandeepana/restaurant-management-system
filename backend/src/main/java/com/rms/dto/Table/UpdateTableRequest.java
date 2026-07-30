package com.rms.dto.Table;

import com.rms.domain.enums.TableStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTableRequest(

        @NotNull(message = "Number is required")
        Integer number,

        @NotNull(message = "Status is required")
        TableStatus status
) {}
