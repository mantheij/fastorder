package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.ProductDTO;
import de.hhn.labfastord.dto.create.NewProductDTO;
import de.hhn.labfastord.models.Product;
import de.hhn.labfastord.repositories.ProductCategoryRepository;
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
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    /**
     * Gets all products.
     *
     * @return all products as ResponseEntity.
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
     * Gets a product by ID.
     *
     * @param id the product ID.
     * @return the product as ResponseEntity.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        try {
            return productRepository.findById(id)
                    .map(product -> ResponseEntity.ok(productMapper(product)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates a product.
     *
     * @param id            the product ID.
     * @param newProductDTO the product data.
     * @return the updated product as ResponseEntity.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody NewProductDTO newProductDTO) {
        try {
            return productRepository.findById(id)
                    .map(existingProduct -> {
                        existingProduct.setName(newProductDTO.getName());
                        existingProduct.setPrice(newProductDTO.getPrice());
                        existingProduct.setImgName(newProductDTO.getImgName());
                        existingProduct.setQuantity(newProductDTO.getQuantity());
                        existingProduct.setAvailable(newProductDTO.getQuantity() > 0);
                        try {
                            existingProduct.setCategory(productCategoryRepository.findById(newProductDTO.getProductCategoryId())
                                    .orElseThrow(NullPointerException::new));
                        } catch (NullPointerException e) {
                            existingProduct.setCategory(null);
                        }
                        existingProduct.setSizes(newProductDTO.getSize());
                        return ResponseEntity.ok(productMapper(productRepository.save(existingProduct)));
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Creates a new product.
     *
     * @param newProductDTO the new product data.
     * @return the created product as ResponseEntity.
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody NewProductDTO newProductDTO) {
        try {
            Product product = new Product();
            product.setName(newProductDTO.getName());
            product.setPrice(newProductDTO.getPrice());
            product.setImgName(newProductDTO.getImgName());
            product.setQuantity(newProductDTO.getQuantity());
            product.setAvailable(newProductDTO.getQuantity() > 0);
            try {
                product.setCategory(productCategoryRepository.findById(newProductDTO.getProductCategoryId())
                        .orElseThrow(NullPointerException::new));
            } catch (NullPointerException e) {
                product.setCategory(null);
            }
            product.setSizes(newProductDTO.getSize());

            return ResponseEntity.ok(productMapper(productRepository.save(product)));
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    /**
     * Deletes a product.
     *
     * @param id the product ID.
     * @return a confirmation message as ResponseEntity.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok("Successfully deleted");

        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Maps data from Product to ProductDTO.
     *
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
        dto.setQuantity(product.getQuantity());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
        } else {
            dto.setCategoryId(null);
        }
        dto.setSize(product.getSizes());
        return dto;
    }
}
