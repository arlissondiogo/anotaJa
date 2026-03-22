package com.uepb.project.anotaJa.controller.user.dto;

import com.uepb.project.anotaJa.domain.user.User;

public record UserResponse(
        String id,
        String ownerName,
        String businessName,
        String email,
        String role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getOwnerName(),
                user.getBusinessName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().name() : null
        );
    }
}