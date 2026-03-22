package com.uepb.project.anotaJa.infra.persistence.user;

import com.uepb.project.anotaJa.domain.user.Role;
import com.uepb.project.anotaJa.domain.user.User;

public class UserDocumentMapper {

    public static UserDocument toDocument(User user) {
        UserDocument doc = new UserDocument();
        doc.setOwnerName(user.getOwnerName());
        doc.setBusinessName(user.getBusinessName());
        doc.setEmail(user.getEmail());
        doc.setPassword(user.getPassword());
        doc.setOwnerId(user.getOwnerId());
        if (user.getRole() != null) {
            doc.setRole(user.getRole().name());
        }
        return doc;
    }

    public static User toDomain(UserDocument doc) {
        Role role = null;
        if (doc.getRole() != null) {
            role = Role.valueOf(doc.getRole());
        }
        return new User(
                doc.getId(),
                doc.getOwnerName(),
                doc.getBusinessName(),
                doc.getEmail(),
                doc.getPassword(),
                role,
                doc.getOwnerId()
        );
    }
}