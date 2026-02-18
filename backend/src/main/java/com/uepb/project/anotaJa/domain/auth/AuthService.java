package com.uepb.project.anotaJa.domain.auth;

import com.uepb.project.anotaJa.domain.user.User;
import com.uepb.project.anotaJa.domain.user.UserRepository;
import com.uepb.project.anotaJa.infra.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository repository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String login(String email, String password) {

        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean senhaOk = passwordEncoder.matches(password, user.getPassword());

        if (!senhaOk) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtService.generateToken(user);
    }
}
