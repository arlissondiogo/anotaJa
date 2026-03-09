package com.uepb.project.anotaJa.controller.table;

import com.uepb.project.anotaJa.domain.table.Table;
import com.uepb.project.anotaJa.domain.table.TableStatus;
import com.uepb.project.anotaJa.infra.table.TableRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tables")
public class TableController {

    private final TableRepository repository;

    public TableController(TableRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Table create(@RequestBody Table table){

        table.setStatus(TableStatus.AVAILABLE);

        return repository.save(table);
    }

    @GetMapping
    public List<Table> list(){

        return repository.findAll();
    }

    @GetMapping("/available")
    public List<Table> available(){

        return repository.findByStatus(TableStatus.AVAILABLE);
    }

    @GetMapping("/progress")
    public List<Table> progress(){

        return repository.findByStatus(TableStatus.IN_PROGRESS);
    }

    @GetMapping("/delivery")
    public List<Table> delivery(){

        return repository.findByStatus(TableStatus.DELIVERY);
    }

    @PostMapping("/{id}/open")
    public Table open(
            @PathVariable String id,
            @RequestParam String clientName){

        Table table = repository.findById(id).orElseThrow();

        table.setClientName(clientName);
        table.setStatus(TableStatus.IN_PROGRESS);

        return repository.save(table);
    }

    @PostMapping("/{id}/close")
    public Table close(@PathVariable String id){

        Table table = repository.findById(id).orElseThrow();

        table.setClientName(null);
        table.setStatus(TableStatus.AVAILABLE);

        return repository.save(table);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){

        repository.deleteById(id);
    }

    @PostMapping("/{id}/open-delivery")
    public Table openDelivery(
            @PathVariable String id,
            @RequestParam String clientName){

        Table table = repository.findById(id).orElseThrow();

        table.setClientName(clientName);
        table.setStatus(TableStatus.DELIVERY);

        return repository.save(table);
    }
}