package com.rms.mapper;

import com.rms.domain.Order;
import com.rms.domain.OrderItem;
import com.rms.dto.OrderItemResponse;
import com.rms.dto.OrderResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(this::toItemResponse)
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getTableNumber(),
                order.getStatus(),
                order.getNotes(),
                order.getCreatedAt(),
                items
        );
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getItemName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getNotes()
        );
    }
}
