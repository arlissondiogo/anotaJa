package com.uepb.project.anotaJa.infra.persistence.user;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SpringUserMongoRepository
        extends MongoRepository<UserDocument, String> {

    boolean existsByEmail(String email);
    Optional<UserDocument> findByEmail(String email);
}