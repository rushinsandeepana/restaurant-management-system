package com.rms.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "meal_variations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealVariation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "price_adjustment", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal priceAdjustment = BigDecimal.ZERO;
}
