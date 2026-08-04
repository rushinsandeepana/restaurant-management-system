package com.rms.service;

import com.rms.domain.Modifier;
import com.rms.dto.Modifier.CreateModifierRequest;
import com.rms.dto.Modifier.ModifierResponse;
import com.rms.dto.Modifier.UpdateModifierRequest;
import com.rms.mapper.ModifierMapper;
import com.rms.repository.ModifierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ModifierService {

    private final ModifierRepository modifierRepository;
    private final ModifierMapper modifierMapper;

    // ── Read (paginated) ──────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<ModifierResponse> findModifiers(String search, Pageable pageable) {
        String term = search == null ? "" : search.trim();
        return modifierRepository.findAllWithSearch(term, pageable)
                .map(modifierMapper::toResponse);
    }

    // ── Read (single) ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ModifierResponse findById(Long id) {
        return modifierMapper.toResponse(getOrThrow(id));
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @SuppressWarnings("null")
    @Transactional
    public ModifierResponse createModifier(CreateModifierRequest request) {
        if (modifierRepository.existsByName(request.name().trim())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Modifier '" + request.name() + "' already exists"
            );
        }

        Modifier modifier = Modifier.builder()
                .name(request.name().trim())
                .slug(request.slug().trim())
                .basePrice(request.basePrice())
                .status(request.status())
                .build();

        return modifierMapper.toResponse(modifierRepository.save(modifier));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Transactional
    public ModifierResponse updateModifier(Long id, UpdateModifierRequest request) {
        Modifier modifier = getOrThrow(id);
        modifier.setName(request.name().trim());
        modifier.setSlug(request.slug().trim());
        modifier.setBasePrice(request.basePrice());
        modifier.setStatus(request.status());
        return modifierMapper.toResponse(modifierRepository.save(modifier));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @SuppressWarnings("null")
    @Transactional
    public void deleteModifier(Long id) {
        if (!modifierRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Modifier not found with id: " + id);
        }
        modifierRepository.deleteById(id);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    @SuppressWarnings("null")
    private Modifier getOrThrow(Long id) {
        return modifierRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Modifier not found with id: " + id));
    }
}
