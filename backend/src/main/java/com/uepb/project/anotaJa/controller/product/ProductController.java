package com.uepb.project.anotaJa.controller.product;

import com.uepb.project.anotaJa.domain.product.Product;
import com.uepb.project.anotaJa.infra.product.ProductRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    private String getOwnerId() {
        return (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        product.setOwnerId(getOwnerId());
        return repository.save(product);
    }

    @GetMapping
    public List<Product> list() {
        return repository.findByOwnerId(getOwnerId());
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable String id, @RequestBody Product product) {
        product.setId(id);
        product.setOwnerId(getOwnerId());
        return repository.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }
}