package com.uepb.project.anotaJa.domain.table;

import com.uepb.project.anotaJa.domain.order.Order;
import com.uepb.project.anotaJa.domain.order.OrderItem;
import com.uepb.project.anotaJa.infra.order.OrderRepository;
import com.uepb.project.anotaJa.infra.table.TableRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TableService {

    private final TableRepository repository;
    private final OrderRepository orderRepository;

    public TableService(
            TableRepository repository,
            OrderRepository orderRepository
    ) {
        this.repository = repository;
        this.orderRepository = orderRepository;
    }

    public void mergeTables(String sourceId, String targetId) {

        if (sourceId.equals(targetId)) {
            throw new RuntimeException("Não é possível mesclar a mesma mesa");
        }

        Table source = repository.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Mesa origem não encontrada"));

        Table target = repository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Mesa destino não encontrada"));

        if (source.getStatus() == TableStatus.AVAILABLE) {
            throw new RuntimeException("Mesa origem está vazia");
        }

        Order sourceOrder = orderRepository
                .findFirstByTableIdAndPaidFalseAndCanceledFalse(sourceId)
                .orElse(null);

        Order targetOrder = orderRepository
                .findFirstByTableIdAndPaidFalseAndCanceledFalse(targetId)
                .orElse(null);

        if (sourceOrder != null) {
            if (targetOrder != null) {
                List<OrderItem> mergedItems = new ArrayList<>();

                for (OrderItem item : targetOrder.getItems()) {
                    mergedItems.add(new OrderItem(
                            item.getProductId(),
                            "[Mesa " + target.getNumber() + "] " + item.getName(),
                            item.getPrice(),
                            item.getQuantity()
                    ));
                }

                for (OrderItem item : sourceOrder.getItems()) {
                    mergedItems.add(new OrderItem(
                            item.getProductId(),
                            "[Mesa " + source.getNumber() + "] " + item.getName(),
                            item.getPrice(),
                            item.getQuantity()
                    ));
                }

                double newTotal = mergedItems.stream()
                        .mapToDouble(i -> i.getPrice() * i.getQuantity())
                        .sum();

                targetOrder.setItems(mergedItems);
                targetOrder.setTotal(newTotal);
                orderRepository.save(targetOrder);

                orderRepository.delete(sourceOrder);

            } else {
                sourceOrder.setTableId(targetId);
                sourceOrder.setClientName(target.getClientName());
                orderRepository.save(sourceOrder);
            }
        }

        repository.delete(source);
    }
}