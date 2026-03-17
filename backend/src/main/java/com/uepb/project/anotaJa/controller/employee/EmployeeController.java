package com.uepb.project.anotaJa.controller.employee;

import com.uepb.project.anotaJa.controller.employee.dto.CreateEmployeeRequest;
import com.uepb.project.anotaJa.domain.employee.Employee;
import com.uepb.project.anotaJa.domain.employee.EmployeeService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping
    public Employee createEmployee(@RequestBody CreateEmployeeRequest request) {

        return service.createEmployee(
                request.name(),
                request.email(),
                request.password(),
                request.role(),
                request.ownerId()
        );
    }
}