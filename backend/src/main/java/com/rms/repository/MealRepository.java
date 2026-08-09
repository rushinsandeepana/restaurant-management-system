package com.rms.repository;

import com.rms.domain.Meal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {

    @EntityGraph(attributePaths = {"category", "variations"})
    @Query("SELECT m FROM Meal m WHERE (:search IS NULL OR :search = '' OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Meal> findAllWithSearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT DISTINCT m FROM Meal m LEFT JOIN FETCH m.modifiers WHERE m.id IN :ids")
    List<Meal> findMealsWithModifiers(@Param("ids") List<Long> ids);
}
