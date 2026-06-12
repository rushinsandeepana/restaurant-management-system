package com.rms.config;

import com.rms.domain.*;
import com.rms.repository.MealRepository;
import com.rms.repository.OrderRepository;
import com.rms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    @Bean
    @Profile("dev")
    CommandLineRunner seedDevData(
            UserRepository userRepository,
            OrderRepository orderRepository,
            MealRepository mealRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            seedUser(userRepository, passwordEncoder,
                    "cashier@rms.local", "Cashier@123", "Cashier User", Role.CASHIER);
            seedUser(userRepository, passwordEncoder,
                    "kitchen@rms.local", "Kitchen@123", "Kitchen Staff", Role.CHEF);

            seedMeals(mealRepository);

            if (orderRepository.count() > 0) {
                return;
            }

            Order order1 = Order.builder()
                    .orderNumber("ORD-001")
                    .tableNumber("T-3")
                    .status(OrderStatus.PREPARING)
                    .notes("No onions")
                    .build();
            order1.setItems(List.of(
                    OrderItem.builder().order(order1).itemName("Chicken Kottu").quantity(2)
                            .unitPrice(new BigDecimal("12.50")).build(),
                    OrderItem.builder().order(order1).itemName("Mango Juice").quantity(2)
                            .unitPrice(new BigDecimal("3.00")).build()
            ));

            Order order2 = Order.builder()
                    .orderNumber("ORD-002")
                    .tableNumber("T-7")
                    .status(OrderStatus.CONFIRMED)
                    .build();
            order2.setItems(List.of(
                    OrderItem.builder().order(order2).itemName("Fried Rice").quantity(1)
                            .unitPrice(new BigDecimal("9.00")).build(),
                    OrderItem.builder().order(order2).itemName("Devilled Chicken").quantity(1)
                            .unitPrice(new BigDecimal("11.00")).notes("Extra spicy").build()
            ));

            Order order3 = Order.builder()
                    .orderNumber("ORD-003")
                    .tableNumber("T-1")
                    .status(OrderStatus.PENDING)
                    .build();
            order3.setItems(List.of(
                    OrderItem.builder().order(order3).itemName("Vegetable Roti").quantity(3)
                            .unitPrice(new BigDecimal("4.50")).build()
            ));

            orderRepository.saveAll(List.of(order1, order2, order3));
        };
    }

    private void seedMeals(MealRepository mealRepository) {
        if (mealRepository.count() > 0) {
            return;
        }

        Meal kottu = Meal.builder()
                .name("Chicken Kottu")
                .imageUrl("https://images.unsplash.com/photo-1603133872878-684f208fb589?w=200&h=200&fit=crop")
                .quantity(45)
                .basePrice(new BigDecimal("12.50"))
                .build();
        kottu.setVariations(List.of(
                MealVariation.builder().name("Regular").priceAdjustment(BigDecimal.ZERO).build(),
                MealVariation.builder().name("Extra Egg").priceAdjustment(new BigDecimal("2.00")).build(),
                MealVariation.builder().name("Double Meat").priceAdjustment(new BigDecimal("4.50")).build()
        ));

        Meal friedRice = Meal.builder()
                .name("Fried Rice")
                .imageUrl("https://images.unsplash.com/photo-1512058564366-78c7e7a64312?w=200&h=200&fit=crop")
                .quantity(30)
                .basePrice(new BigDecimal("9.00"))
                .build();
        friedRice.setVariations(List.of(
                MealVariation.builder().name("Vegetable").priceAdjustment(BigDecimal.ZERO).build(),
                MealVariation.builder().name("Chicken").priceAdjustment(new BigDecimal("3.00")).build(),
                MealVariation.builder().name("Seafood").priceAdjustment(new BigDecimal("5.00")).build()
        ));

        Meal juice = Meal.builder()
                .name("Mango Juice")
                .imageUrl("https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop")
                .quantity(60)
                .basePrice(new BigDecimal("3.00"))
                .build();

        mealRepository.saveAll(List.of(kottu, friedRice, juice));
    }

    private void seedUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String email,
            String password,
            String fullName,
            Role role
    ) {
        if (userRepository.existsByEmail(email)) {
            return;
        }
        userRepository.save(User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .fullName(fullName)
                .role(role)
                .active(true)
                .build());
    }
}
