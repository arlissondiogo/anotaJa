package com.uepb.project.anotaJa.controller.product;

import com.uepb.project.anotaJa.domain.product.Product;
import com.uepb.project.anotaJa.infra.product.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Product create(@RequestBody Product product){

        return repository.save(product);
    }

    @GetMapping
    public List<Product> list(){

        return repository.findAll();
    }

    @PutMapping("/{id}")
    public Product update(
            @PathVariable String id,
            @RequestBody Product product){

        product.setId(id);

        return repository.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){

        repository.deleteById(id);
    }

}