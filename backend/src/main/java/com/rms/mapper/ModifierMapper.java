package com.rms.mapper;

import com.rms.domain.Modifier;
import com.rms.dto.Modifier.ModifierResponse;
import org.springframework.stereotype.Component;

@Component
public class ModifierMapper {

    public ModifierResponse toResponse(Modifier modifier) {
        return new ModifierResponse(
                modifier.getId(),
                modifier.getName(),
                modifier.getSlug(),
                modifier.getStatus(),
                modifier.getBasePrice(),
                modifier.getCreatedAt(),
                modifier.getUpdatedAt()
        );
    }
}

