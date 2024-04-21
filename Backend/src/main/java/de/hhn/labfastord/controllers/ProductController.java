package de.hhn.labfastord.controllers;


import de.hhn.labfastord.dto.ProductDTO;
import de.hhn.labfastord.models.Product;
import de.hhn.labfastord.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::pruductMapper).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(pruductMapper(product)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private ProductDTO pruductMapper(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setImgName(product.getImgName());
        dto.setAvailable(product.isAvailable());
        dto.setCategoryId(product.getCategory().getCategoryId());
        return dto;
    }
}
