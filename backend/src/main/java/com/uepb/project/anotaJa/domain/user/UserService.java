package com.uepb.project.anotaJa.domain.user;

import com.uepb.project.anotaJa.domain.user.exception.EmailAlreadyInUseException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String ownerName, String businessName, String email, String rawPassword) {
        if (repository.existsByEmail(email)) {
            throw new EmailAlreadyInUseException();
        }
        String hashedPassword = passwordEncoder.encode(rawPassword);
        return repository.save(new User(ownerName, businessName, email, hashedPassword, Role.OWNER));
    }

    public User createEmployee(String name, String email, String rawPassword, Role role, String ownerId) {
        if (repository.existsByEmail(email)) {
            throw new EmailAlreadyInUseException();
        }
        String hashedPassword = passwordEncoder.encode(rawPassword);
        return repository.save(new User(name, null, email, hashedPassword, role, ownerId));
    }

    public User findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}