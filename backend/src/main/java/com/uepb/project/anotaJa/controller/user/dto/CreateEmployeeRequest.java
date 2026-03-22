package com.uepb.project.anotaJa.controller.user.dto;

import com.uepb.project.anotaJa.domain.user.Role;

public record CreateEmployeeRequest(
        String name,
        String email,
        String password,
        Role role
) {}