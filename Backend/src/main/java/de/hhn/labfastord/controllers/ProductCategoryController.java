package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.ProductCategoryDTO;
import de.hhn.labfastord.models.ProductCategory;
import de.hhn.labfastord.models.Product;
import de.hhn.labfastord.repositories.ProductCategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.List;

/**
 * The ProductCategoryController class manages the web requests for product categories.
 */
@RestController
@RequestMapping("/api/productCategories")
public class ProductCategoryController {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    /**
     * Retrieves all product categories.
     * @return A ResponseEntity containing a list of ProductCategoryDTOs or an internal server error if an exception occurs.
     */
    @GetMapping
    public ResponseEntity<List<ProductCategoryDTO>> getAllProductCategories() {
        try {
            List<ProductCategoryDTO> categories = productCategoryRepository.findAll().stream().map(this::categoryMapper).toList();
            return ResponseEntity.ok(categories);
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves a specific product category by ID.
     * @param id the ID of the product category to retrieve
     * @return A ResponseEntity containing the found ProductCategoryDTO, or a not found status if not present, or an internal server error if an exception occurs.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductCategoryDTO> getProductCategoryById(@PathVariable Integer id) {
        try {
            return productCategoryRepository.findById(id)
                    .map(category -> ResponseEntity.ok(categoryMapper(category)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates an existing product category identified by ID.
     * @param id the ID of the product category to update
     * @param categoryDTO the product category data to update
     * @return A ResponseEntity containing the updated product category, or a not found status if no product category is found, or an internal server error if an exception occurs.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductCategoryDTO> updateProductCategory(@PathVariable Integer id, @RequestBody ProductCategoryDTO categoryDTO) {
        try {
            return productCategoryRepository.findById(id)
                    .map(existingCategory -> {
                        existingCategory.setName(categoryDTO.getName());
                        existingCategory.setDescription(categoryDTO.getDescription());
                        return ResponseEntity.ok(categoryMapper(productCategoryRepository.save(existingCategory)));
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ProductCategory createProductCategory(@RequestBody ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer id) {
        try {
            productCategoryRepository.deleteById(id);
            return ResponseEntity.ok("Successfully deleted");

        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Maps data from ProductCategory to ProductCategoryDTO.
     * @param productCategory the ProductCategory entity
     * @return a new instance of ProductCategoryDTO with mapped data
     */
    private ProductCategoryDTO categoryMapper(ProductCategory productCategory) {
        ProductCategoryDTO dto = new ProductCategoryDTO();
        dto.setCategoryId(productCategory.getCategoryId());
        dto.setName(productCategory.getName());
        dto.setDescription(productCategory.getDescription());
        dto.setProductsId(productCategory.getProducts().stream()
                .map(Product::getProductId)
                .toList());
        return dto;
    }
}
