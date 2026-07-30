package com.rms.dto.Table;

import com.rms.domain.enums.TableStatus;

import java.time.Instant;

public record TableResponse(
        Long id,
        String name,
        Integer number,
        TableStatus status,
        Instant createdAt,
        Instant updatedAt
) {}
