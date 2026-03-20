package com.uepb.project.anotaJa.controller.employee;

import com.uepb.project.anotaJa.controller.employee.dto.CreateEmployeeRequest;
import com.uepb.project.anotaJa.domain.employee.Employee;
import com.uepb.project.anotaJa.domain.employee.EmployeeService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    @GetMapping
    public List<Employee> list() {
        String requesterId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return service.listByRequester(requesterId);
    }

    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    @PostMapping
    public Employee createEmployee(@RequestBody CreateEmployeeRequest request) {
        String requesterId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return service.createEmployee(
                request.name(),
                request.email(),
                request.password(),
                request.role(),
                requesterId
        );
    }

    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.deleteEmployee(id);
    }
}