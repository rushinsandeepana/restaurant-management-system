package com.rms.dto;

import com.rms.domain.Role;
import com.rms.domain.User;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        Role role
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}
