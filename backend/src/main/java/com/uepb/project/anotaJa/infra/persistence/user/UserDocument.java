package com.uepb.project.anotaJa.infra.persistence.user;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class UserDocument {

    @Id
    private String id;

    private String ownerName;
    private String businessName;
    private String email;
    private String password;
    private String role;
    private String ownerId;
}
