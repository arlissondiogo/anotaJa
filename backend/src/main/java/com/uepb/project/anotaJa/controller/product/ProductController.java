package com.uepb.project.anotaJa.controller.product;

import com.uepb.project.anotaJa.domain.product.Product;
import com.uepb.project.anotaJa.domain.user.Role;
import com.uepb.project.anotaJa.domain.user.User;
import com.uepb.project.anotaJa.domain.user.UserRepository;
import com.uepb.project.anotaJa.infra.product.ProductRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository repository;
    private final UserRepository userRepository;

    public ProductController(ProductRepository repository, UserRepository userRepository) {
        this.repository = repository;
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
    public Product create(@RequestBody Product product) {
        product.setOwnerId(resolveOwnerId());
        return repository.save(product);
    }

    @GetMapping
    public List<Product> list() {
        return repository.findByOwnerId(resolveOwnerId());
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable String id, @RequestBody Product product) {
        product.setId(id);
        product.setOwnerId(resolveOwnerId());
        return repository.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }
}