package com.rms.service;

import com.rms.domain.RestaurantTable;
import com.rms.dto.Table.CreateTableRequest;
import com.rms.dto.Table.TableResponse;
import com.rms.dto.Table.UpdateTableRequest;
import com.rms.mapper.TableMapper;
import com.rms.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository tableRepository;
    private final TableMapper tableMapper;

    // ── Read (paginated) ──────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<TableResponse> findTables(String search, Pageable pageable) {
        String term = search == null ? "" : search.trim();
        return tableRepository.findAllWithSearch(term, pageable)
                .map(tableMapper::toResponse);
    }

    // ── Read (single) ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public TableResponse findById(Long id) {
        return tableMapper.toResponse(getOrThrow(id));
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public TableResponse createTable(CreateTableRequest request) {

        if (tableRepository.existsByName(request.name().trim())) {
            
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Table '" + request.name() + "' already exists"
            );
        }

        RestaurantTable table = RestaurantTable.builder()
                .name(request.name().trim())
                .number(request.number())
                .status(request.status())
                .build();

        return tableMapper.toResponse(tableRepository.save(table));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Transactional
    public TableResponse updateTable(Long id, UpdateTableRequest request) {
        RestaurantTable table = getOrThrow(id);
        table.setStatus(request.status());
        return tableMapper.toResponse(tableRepository.save(table));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Transactional
    public void deleteTable(Long id) {
        if (!tableRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Table not found with id: " + id);
        }
        tableRepository.deleteById(id);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private RestaurantTable getOrThrow(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Table not found with id: " + id));
    }
}
