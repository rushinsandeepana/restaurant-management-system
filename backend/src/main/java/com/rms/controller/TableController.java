package com.rms.controller;

import com.rms.dto.Table.CreateTableRequest;
import com.rms.dto.Table.TableResponse;
import com.rms.dto.Table.UpdateTableRequest;
import com.rms.service.TableService;
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
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    // GET /api/tables?search=&page=0&size=10
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<Page<TableResponse>> getTables(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(tableService.findTables(search, pageable));
    }

    // GET /api/tables/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<TableResponse> getTable(@PathVariable Long id) {
        return ResponseEntity.ok(tableService.findById(id));
    }

    // POST /api/tables
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<TableResponse> createTable(
            @Valid @RequestBody CreateTableRequest request
    ) {
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tableService.createTable(request));
    }

    // PUT /api/tables/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<TableResponse> updateTable(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTableRequest request
    ) {
        return ResponseEntity.ok(tableService.updateTable(id, request));
    }

    // DELETE /api/tables/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CASHIER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}
