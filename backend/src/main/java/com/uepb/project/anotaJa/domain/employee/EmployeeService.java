package com.uepb.project.anotaJa.domain.employee;

import com.uepb.project.anotaJa.domain.user.Role;
import com.uepb.project.anotaJa.infra.employee.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Employee createEmployee(
            String name,
            String email,
            String password,
            Role role,
            String ownerId
    ) {

        if (repository.existsByEmail(email)) {
            throw new RuntimeException("Email já está em uso");
        }

        String hashedPassword = passwordEncoder.encode(password);

        Employee employee = new Employee(
                name,
                email,
                hashedPassword,
                role,
                ownerId
        );

        return repository.save(employee);
    }
}