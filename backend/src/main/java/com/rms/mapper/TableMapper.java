package com.rms.mapper;

import com.rms.domain.RestaurantTable;
import com.rms.dto.Table.TableResponse;
import org.springframework.stereotype.Component;

@Component
public class TableMapper {

    public TableResponse toResponse(RestaurantTable table) {
        return new TableResponse(
                table.getId(),
                table.getName(),
                table.getNumber(),
                table.getStatus(),
                table.getCreatedAt(),
                table.getUpdatedAt()
        );
    }
}
