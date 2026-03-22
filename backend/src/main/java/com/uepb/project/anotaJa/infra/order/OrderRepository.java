package com.uepb.project.anotaJa.infra.order;

import com.uepb.project.anotaJa.domain.order.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {
    Optional<Order> findFirstByTableIdAndPaidFalseAndCanceledFalse(String tableId);
    List<Order> findByTableId(String tableId);
    List<Order> findByOwnerIdAndPaidFalseAndCanceledFalse(String ownerId);
    List<Order> findByOwnerIdAndCanceledTrue(String ownerId);
    List<Order> findByOwnerIdAndPaidTrue(String ownerId);
}