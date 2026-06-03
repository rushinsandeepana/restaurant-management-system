package com.rms.service;

import com.rms.dto.OrderResponse;
import com.rms.mapper.OrderMapper;
import com.rms.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public List<OrderResponse> findAllOrders() {
        return orderRepository.findAllWithItemsOrderByCreatedAtDesc().stream()
                .map(orderMapper::toResponse)
                .toList();
    }
}
