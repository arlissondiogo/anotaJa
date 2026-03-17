package com.uepb.project.anotaJa.domain.table;

import com.uepb.project.anotaJa.domain.order.Order;
import com.uepb.project.anotaJa.infra.order.OrderRepository;
import com.uepb.project.anotaJa.infra.table.TableRepository;
import org.springframework.stereotype.Service;

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

        if(sourceId.equals(targetId)){
            throw new RuntimeException("Não é possível mesclar a mesma mesa");
        }

        Table source = repository.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Mesa origem não encontrada"));

        Table target = repository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Mesa destino não encontrada"));

        if(source.getStatus() == TableStatus.AVAILABLE){
            throw new RuntimeException("Mesa origem está vazia");
        }

        List<Order> orders = orderRepository.findByTableId(sourceId);

        for(Order order : orders){
            order.setTableId(targetId);
            orderRepository.save(order);
        }

        repository.delete(source);
    }
}