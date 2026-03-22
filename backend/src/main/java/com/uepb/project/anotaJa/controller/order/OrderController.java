package com.uepb.project.anotaJa.controller.order;

import com.uepb.project.anotaJa.domain.order.Order;
import com.uepb.project.anotaJa.infra.order.OrderRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository repository;

    public OrderController(OrderRepository repository) {
        this.repository = repository;
    }

    private String getOwnerId() {
        return (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        order.setPaid(false);
        order.setCanceled(false);
        order.setOwnerId(getOwnerId());
        return repository.save(order);
    }

    @GetMapping("/table/{tableId}")
    public Order getByTable(@PathVariable String tableId) {
        return repository
                .findFirstByTableIdAndPaidFalseAndCanceledFalse(tableId)
                .orElse(null);
    }

    @GetMapping("/recentes")
    public List<Order> recentes() {
        return repository.findByOwnerIdAndPaidFalseAndCanceledFalse(getOwnerId());
    }

    @GetMapping("/cancelados")
    public List<Order> cancelados() {
        return repository.findByOwnerIdAndCanceledTrue(getOwnerId());
    }

    @GetMapping("/finalizados")
    public List<Order> finalizados() {
        return repository.findByOwnerIdAndPaidTrue(getOwnerId());
    }

    @PostMapping("/{id}/pay")
    public Order pay(@PathVariable String id) {
        Order order = repository.findById(id).orElseThrow();
        order.setPaid(true);
        return repository.save(order);
    }

    @PostMapping("/{id}/cancel")
    public Order cancel(@PathVariable String id) {
        Order order = repository.findById(id).orElseThrow();
        if (order.getPaid()) {
            throw new RuntimeException("Pedido já foi pago e não pode ser cancelado.");
        }
        order.setCanceled(true);
        return repository.save(order);
    }

    @PutMapping("/{id}")
    public Order update(@PathVariable String id, @RequestBody Order updatedOrder) {
        Order order = repository.findById(id).orElseThrow();
        if (order.getPaid()) {
            throw new RuntimeException("Pedido já pago não pode ser editado.");
        }
        if (order.getCanceled()) {
            throw new RuntimeException("Pedido cancelado não pode ser editado.");
        }
        order.setItems(updatedOrder.getItems());
        order.setTotal(updatedOrder.getTotal());
        return repository.save(order);
    }
}