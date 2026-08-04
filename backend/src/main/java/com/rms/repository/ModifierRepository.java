package com.rms.repository;

import com.rms.domain.Modifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ModifierRepository extends JpaRepository<Modifier, Long> {

    boolean existsByName(String name);

    @Query("SELECT t FROM Modifier t WHERE (:search IS NULL OR :search = '' OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Modifier> findAllWithSearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT t.slug FROM Modifier t")
    List<String> findAllSlugs();
}
