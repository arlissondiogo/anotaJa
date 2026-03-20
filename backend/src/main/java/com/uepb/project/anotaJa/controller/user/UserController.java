package com.uepb.project.anotaJa.controller.user;

import com.uepb.project.anotaJa.controller.user.dto.UserRequest;
import com.uepb.project.anotaJa.controller.user.dto.UserResponse;
import com.uepb.project.anotaJa.controller.user.dto.CreateEmployeeRequest;
import com.uepb.project.anotaJa.domain.user.User;
import com.uepb.project.anotaJa.domain.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UserResponse> register(
            @RequestBody @Valid UserRequest request
    ) {
        User user = service.register(
                request.ownerName(),
                request.businessName(),
                request.email(),
                request.password()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponse.from(user));
    }

    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    @PostMapping("/employee")
    public ResponseEntity<UserResponse> createEmployee(
            @RequestBody CreateEmployeeRequest request
    ) {
        String ownerId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = service.createEmployee(
                request.name(),
                request.email(),
                request.password(),
                request.role(),
                ownerId
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponse.from(user));
    }
}