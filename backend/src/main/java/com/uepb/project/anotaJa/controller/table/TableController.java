package com.uepb.project.anotaJa.controller.table;

import com.uepb.project.anotaJa.controller.table.dto.MergeTablesRequest;
import com.uepb.project.anotaJa.controller.table.dto.OpenDeliveryRequest;
import com.uepb.project.anotaJa.domain.table.Table;
import com.uepb.project.anotaJa.domain.table.TableService;
import com.uepb.project.anotaJa.domain.table.TableStatus;
import com.uepb.project.anotaJa.domain.user.Role;
import com.uepb.project.anotaJa.domain.user.UserRepository;
import com.uepb.project.anotaJa.infra.table.TableRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tables")
public class TableController {

    private final TableRepository repository;
    private final TableService service;
    private final UserRepository userRepository;

    public TableController(
            TableRepository repository,
            TableService service,
            UserRepository userRepository
    ) {
        this.repository = repository;
        this.service = service;
        this.userRepository = userRepository;
    }

    private String getRequesterId() {
        return (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    private String resolveOwnerId() {
        String requesterId = getRequesterId();
        return userRepository.findById(requesterId)
                .map(user -> {
                    if (user.getRole() != Role.OWNER && user.getOwnerId() != null) {
                        return user.getOwnerId();
                    }
                    return requesterId;
                })
                .orElse(requesterId);
    }

    @PostMapping
    public Table create(@RequestBody Table table) {
        table.setOwnerId(resolveOwnerId());
        table.setStatus(TableStatus.AVAILABLE);
        return repository.save(table);
    }

    @GetMapping
    public List<Table> list() {
        return repository.findByOwnerId(resolveOwnerId());
    }

    @GetMapping("/available")
    public List<Table> available() {
        return repository.findByStatus(TableStatus.AVAILABLE);
    }

    @GetMapping("/progress")
    public List<Table> progress() {
        return repository.findByStatus(TableStatus.IN_PROGRESS);
    }

    @GetMapping("/delivery")
    public List<Table> delivery() {
        return repository.findByStatus(TableStatus.DELIVERY);
    }

    @PostMapping("/{id}/open")
    public Table open(@PathVariable String id, @RequestParam String clientName) {
        Table table = repository.findById(id).orElseThrow();
        table.setClientName(clientName);
        table.setStatus(TableStatus.IN_PROGRESS);
        return repository.save(table);
    }

    @PostMapping("/{id}/close")
    public Table close(@PathVariable String id) {
        Table table = repository.findById(id).orElseThrow();
        table.setClientName(null);
        table.setStatus(TableStatus.AVAILABLE);
        table.setAddress(null);
        table.setPhone(null);
        table.setFee(null);
        table.setNotes(null);
        table.setDeliveryStatus(null);
        return repository.save(table);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }

    @PostMapping("/{id}/open-delivery")
    public Table openDelivery(
            @PathVariable String id,
            @RequestParam String clientName,
            @RequestBody(required = false) OpenDeliveryRequest body
    ) {
        Table table = repository.findById(id).orElseThrow();
        table.setClientName(clientName);
        table.setStatus(TableStatus.DELIVERY);

        if (body != null) {
            table.setAddress(body.address());
            table.setPhone(body.phone());
            table.setFee(body.fee() != null ? body.fee() : 0.0);
            table.setNotes(body.notes());
            table.setDeliveryStatus(body.deliveryStatus() != null ? body.deliveryStatus() : "WAITING");
        } else {
            table.setDeliveryStatus("WAITING");
            table.setFee(0.0);
        }

        return repository.save(table);
    }

    @PatchMapping("/{id}/delivery-status")
    public Table updateDeliveryStatus(
            @PathVariable String id,
            @RequestParam String deliveryStatus
    ) {
        Table table = repository.findById(id).orElseThrow();
        table.setDeliveryStatus(deliveryStatus);
        return repository.save(table);
    }

    @PreAuthorize("hasAnyRole('OWNER','MANAGER','RECEPTION')")
    @PostMapping("/merge")
    public ResponseEntity<Void> mergeTables(@RequestBody MergeTablesRequest request) {
        service.mergeTables(request.sourceTableId(), request.targetTableId());
        return ResponseEntity.ok().build();
    }
}