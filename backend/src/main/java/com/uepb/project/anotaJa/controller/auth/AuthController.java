package com.uepb.project.anotaJa.controller.auth;

import com.uepb.project.anotaJa.controller.auth.dto.LoginRequest;
import com.uepb.project.anotaJa.controller.auth.dto.LoginResponse;
import com.uepb.project.anotaJa.domain.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody @Valid LoginRequest request
    ) {
        String token = service.login(request.email(), request.password());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
