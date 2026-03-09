package com.uepb.project.anotaJa.infra.product;

import com.uepb.project.anotaJa.domain.product.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {

}