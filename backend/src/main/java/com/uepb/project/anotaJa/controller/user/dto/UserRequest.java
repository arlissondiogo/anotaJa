package com.uepb.project.anotaJa.controller.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequest(

        @NotBlank String ownerName,
        @NotBlank String businessName,
        @Email @NotBlank String email,
        @NotBlank String password
) {}