package com.rms.repository;

import com.rms.domain.RestaurantTable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TableRepository extends JpaRepository<RestaurantTable, Long> {

    boolean existsByName(String name);

    @Query("SELECT t FROM RestaurantTable t WHERE (:search IS NULL OR :search = '' OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<RestaurantTable> findAllWithSearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT t.number FROM RestaurantTable t")
    List<Integer> findAllNumbers();
}
