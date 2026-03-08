package com.uepb.project.anotaJa.infra.order;

import com.uepb.project.anotaJa.domain.order.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {

    Optional<Order> findByTableId(String tableId);

}