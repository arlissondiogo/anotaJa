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

        // Busca pedidos ativos das duas mesas
        Order sourceOrder = orderRepository
                .findFirstByTableIdAndPaidFalseAndCanceledFalse (sourceId)
                .orElse(null);

        Order targetOrder = orderRepository
                .findFirstByTableIdAndPaidFalseAndCanceledFalse (targetId)
                .orElse(null);

        if (sourceOrder != null) {
            if (targetOrder != null) {
                // Marca os itens da mesa origem com a nota de origem
                List<OrderItem> mergedItems = new ArrayList<>();

                // Adiciona itens da mesa destino com nota
                for (OrderItem item : targetOrder.getItems()) {
                    OrderItem tagged = new OrderItem(
                            item.getProductId(),
                            "[Mesa " + target.getNumber() + "] " + item.getName(),
                            item.getPrice(),
                            item.getQuantity()
                    );
                    mergedItems.add(tagged);
                }

                // Adiciona itens da mesa origem com nota
                for (OrderItem item : sourceOrder.getItems()) {
                    OrderItem tagged = new OrderItem(
                            item.getProductId(),
                            "[Mesa " + source.getNumber() + "] " + item.getName(),
                            item.getPrice(),
                            item.getQuantity()
                    );
                    mergedItems.add(tagged);
                }

                // Calcula novo total
                double newTotal = mergedItems.stream()
                        .mapToDouble(i -> i.getPrice() * i.getQuantity())
                        .sum();

                // Atualiza pedido da mesa destino
                targetOrder.setItems(mergedItems);
                targetOrder.setTotal(newTotal);
                orderRepository.save(targetOrder);

                // Cancela pedido da mesa origem
                sourceOrder.setCanceled(true);
                orderRepository.save(sourceOrder);

            } else {
                // Mesa destino não tem pedido — move o pedido da origem
                sourceOrder.setTableId(targetId);
                sourceOrder.setClientName(target.getClientName());
                orderRepository.save(sourceOrder);
            }
        }

        // Deleta a mesa origem
        repository.delete(source);
    }
}