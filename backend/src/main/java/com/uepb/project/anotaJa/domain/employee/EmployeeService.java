package com.uepb.project.anotaJa.domain.employee;

import com.uepb.project.anotaJa.domain.user.Role;
import com.uepb.project.anotaJa.domain.user.User;
import com.uepb.project.anotaJa.domain.user.UserRepository;
import com.uepb.project.anotaJa.domain.user.UserService;
import com.uepb.project.anotaJa.infra.employee.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final UserRepository userRepository;

    public EmployeeService(
            EmployeeRepository repository,
            PasswordEncoder passwordEncoder,
            UserService userService,
            UserRepository userRepository
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public Employee createEmployee(
            String name,
            String email,
            String password,
            Role role,
            String requesterId  // id de quem está fazendo a requisição
    ) {
        if (repository.existsByEmail(email)) {
            throw new RuntimeException("Email já está em uso");
        }

        // resolve o ownerId real: se quem criou é MANAGER, pega o ownerId dele
        String ownerId = resolveOwnerId(requesterId);

        userService.createEmployee(name, email, password, role, ownerId);

        String hashedPassword = passwordEncoder.encode(password);

        Employee employee = new Employee(name, email, hashedPassword, role, ownerId);

        return repository.save(employee);
    }

    private String resolveOwnerId(String requesterId) {
        return userRepository.findById(requesterId)
                .map(user -> {
                    // se for MANAGER, usa o ownerId dele (que é o dono)
                    if (user.getRole() == Role.MANAGER && user.getOwnerId() != null) {
                        return user.getOwnerId();
                    }
                    // se for OWNER, usa o próprio id
                    return requesterId;
                })
                .orElse(requesterId);
    }

    public List<Employee> findByOwnerId(String ownerId) {
        return repository.findByOwnerId(ownerId);
    }

    public void deleteEmployee(String id) {
        repository.deleteById(id);
    }

    public List<Employee> listByRequester(String requesterId) {
        String ownerId = resolveOwnerId(requesterId);
        return repository.findByOwnerId(ownerId);
    }
}