package com.uepb.project.anotaJa.infra.employee;

import com.uepb.project.anotaJa.domain.employee.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EmployeeRepository extends MongoRepository<Employee, String> {

    boolean existsByEmail(String email);
    List<Employee> findByOwnerId(String ownerId);

}