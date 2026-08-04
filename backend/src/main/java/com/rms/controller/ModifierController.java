package com.rms.controller;

import com.rms.dto.Modifier.CreateModifierRequest;
import com.rms.dto.Modifier.ModifierResponse;
import com.rms.dto.Modifier.UpdateModifierRequest;
import com.rms.service.ModifierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/modifiers")
@RequiredArgsConstructor
public class ModifierController {

    private final ModifierService modifierService;

    // GET /api/modifiers?search=&page=0&size=10
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<Page<ModifierResponse>> getModifiers(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(modifierService.findModifiers(search, pageable));
    }

    // GET /api/modifiers/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<ModifierResponse> getModifier(@PathVariable Long id) {
        return ResponseEntity.ok(modifierService.findById(id));
    }

    // POST /api/modifiers
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<ModifierResponse> createModifier(
            @Valid @RequestBody CreateModifierRequest request
    ) {
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(modifierService.createModifier(request));
    }

    // PUT /api/modifiers/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<ModifierResponse> updateModifier(
            @PathVariable Long id,
            @Valid @RequestBody UpdateModifierRequest request
    ) {
        return ResponseEntity.ok(modifierService.updateModifier(id, request));
    }

    // DELETE /api/tables/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<Void> deleteModifier(@PathVariable Long id) {
        modifierService.deleteModifier(id);
        return ResponseEntity.noContent().build();
    }
}