package com.uepb.project.anotaJa.infra.persistence.user;

import com.uepb.project.anotaJa.domain.user.User;

public class UserDocumentMapper {

    public static UserDocument toDocument(User user) {
        UserDocument doc = new UserDocument();
        doc.setOwnerName(user.getOwnerName());
        doc.setBusinessName(user.getBusinessName());
        doc.setEmail(user.getEmail());
        doc.setPassword(user.getPassword());
        return doc;
    }

    public static User toDomain(UserDocument doc) {
        return new User(
                doc.getId(),
                doc.getOwnerName(),
                doc.getBusinessName(),
                doc.getEmail(),
                doc.getPassword()
        );
    }
}