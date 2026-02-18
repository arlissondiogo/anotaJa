package com.uepb.project.anotaJa.domain.user;

import lombok.Getter;

@Getter
public class User {

    private String id;
    private String ownerName;
    private String businessName;
    private String email;
    private String password;

    public User(String ownerName, String businessName, String email, String password) {
        this.ownerName = ownerName;
        this.businessName = businessName;
        this.email = email;
        this.password = password;
    }

    public User(String id, String ownerName, String businessName, String email, String password) {
        this.id = id;
        this.ownerName = ownerName;
        this.businessName = businessName;
        this.email = email;
        this.password = password;
    }

}