package com.uepb.project.anotaJa.infra.product;

import com.uepb.project.anotaJa.domain.product.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByOwnerId(String ownerId);
}