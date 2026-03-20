package com.uepb.project.anotaJa.domain.user;

import lombok.Getter;

@Getter
public class User {

    private String id;
    private String ownerName;
    private String businessName;
    private String email;
    private String password;
    private Role role;
    private String ownerId; // novo

    // construtor para registro de dono
    public User(String ownerName, String businessName, String email, String password, Role role) {
        this.ownerName = ownerName;
        this.businessName = businessName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.ownerId = null;
    }

    // construtor completo com id (usado no mapper)
    public User(String id, String ownerName, String businessName, String email, String password, Role role) {
        this.id = id;
        this.ownerName = ownerName;
        this.businessName = businessName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.ownerId = null;
    }

    // construtor completo com id e ownerId
    public User(String id, String ownerName, String businessName, String email, String password, Role role, String ownerId) {
        this.id = id;
        this.ownerName = ownerName;
        this.businessName = businessName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.ownerId = ownerId;
    }

    // construtor para criação de funcionário
    public User(String ownerName, String businessName, String email, String password, Role role, String ownerId) {
        this.ownerName = ownerName;
        this.businessName = businessName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.ownerId = ownerId;
    }
}