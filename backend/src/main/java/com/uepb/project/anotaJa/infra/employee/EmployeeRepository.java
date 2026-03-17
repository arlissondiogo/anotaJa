package com.uepb.project.anotaJa.infra.employee;

import com.uepb.project.anotaJa.domain.employee.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmployeeRepository extends MongoRepository<Employee, String> {

    boolean existsByEmail(String email);

}