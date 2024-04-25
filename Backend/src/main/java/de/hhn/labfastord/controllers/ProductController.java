package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.ProductDTO;
import de.hhn.labfastord.models.Product;
import de.hhn.labfastord.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.List;

/**
 * The ProductController class manages the web requests related to products.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    /**
     * Retrieves all products.
     * @return A ResponseEntity containing a list of ProductDTOs or an internal server error if an exception occurs.
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        try {
            List<ProductDTO> products = productRepository.findAll().stream().map(this::productMapper).toList();
            return ResponseEntity.ok(products);
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves a specific product by ID.
     * @param id the ID of the product to retrieve
     * @return A ResponseEntity containing the found ProductDTO, or a not found status if not present, or an internal server error if an exception occurs.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        try {
            return productRepository.findById(id)
                    .map(product -> ResponseEntity.ok(productMapper(product)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates an existing product identified by ID.
     * @param id the ID of the product to update
     * @param productDTO the product data to update
     * @return A ResponseEntity containing the updated product, or a not found status if no product is found, or an internal server error if an exception occurs.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Integer id, @RequestBody ProductDTO productDTO) {
        try {
            return productRepository.findById(id)
                    .map(existingProduct -> {
                        existingProduct.setName(productDTO.getName());
                        existingProduct.setPrice(productDTO.getPrice());
                        existingProduct.setImgName(productDTO.getImgName());
                        existingProduct.setAvailable(productDTO.isAvailable());
                        return ResponseEntity.ok(productMapper(productRepository.save(existingProduct)));
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer id) {
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok("Successfully deleted");

        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Maps data from Product to ProductDTO.
     * @param product the Product entity
     * @return a new instance of ProductDTO with mapped data
     */
    private ProductDTO productMapper(Product product) {
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
