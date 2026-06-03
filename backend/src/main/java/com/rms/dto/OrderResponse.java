package com.rms.dto;

import com.rms.domain.OrderStatus;

import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        String tableNumber,
        OrderStatus status,
        String notes,
        Instant createdAt,
        List<OrderItemResponse> items
) {}
