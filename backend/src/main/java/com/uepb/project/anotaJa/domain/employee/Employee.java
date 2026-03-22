package com.uepb.project.anotaJa.domain.employee;

import com.uepb.project.anotaJa.domain.user.Role;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document(collection = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;
    private Role role;
    private String ownerId;

    public Employee(String name, String email, String password, Role role, String ownerId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.ownerId = ownerId;
    }

}