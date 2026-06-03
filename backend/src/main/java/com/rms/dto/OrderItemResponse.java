package com.rms.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        String itemName,
        int quantity,
        BigDecimal unitPrice,
        String notes
) {}
