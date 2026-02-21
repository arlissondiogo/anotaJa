package com.uepb.project.anotaJa.infra.persistence.user;

import com.uepb.project.anotaJa.domain.user.User;
import com.uepb.project.anotaJa.domain.user.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class MongoUserRepository implements UserRepository {

    private final SpringUserMongoRepository repository;

    public MongoUserRepository(SpringUserMongoRepository repository) {
        this.repository = repository;
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public User save(User user) {
        UserDocument saved = repository.save(
                UserDocumentMapper.toDocument(user)
        );
        return UserDocumentMapper.toDomain(saved);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email)
                .map(UserDocumentMapper::toDomain);
    }

}