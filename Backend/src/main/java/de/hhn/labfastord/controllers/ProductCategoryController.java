package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.NewProductCategoryDTO;
import de.hhn.labfastord.dto.ProductCategoryDTO;
import de.hhn.labfastord.models.ProductCategory;
import de.hhn.labfastord.models.Product;
import de.hhn.labfastord.repositories.ProductCategoryRepository;

import de.hhn.labfastord.repositories.ProductRepository;
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

    @Autowired
    private ProductRepository productRepository;

    /**
     * Retrieves all product categories.
     *
     * @return A ResponseEntity containing a list of ProductCategoryDTOs or an internal server error if an exception occurs.
     */
    @GetMapping
    public ResponseEntity<List<ProductCategoryDTO>> getAllProductCategories() {
        try {
            List<ProductCategoryDTO> categories = productCategoryRepository.findAll().stream().map(this::toDto).toList();
            return ResponseEntity.ok(categories);
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves a specific product category by ID.
     *
     * @param id the ID of the product category to retrieve
     * @return A ResponseEntity containing the found ProductCategoryDTO, or a not found status if not present, or an internal server error if an exception occurs.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductCategoryDTO> getProductCategoryById(@PathVariable Long id) {
        try {
            return productCategoryRepository.findById(id)
                    .map(category -> ResponseEntity.ok(toDto(category)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates an existing product category identified by ID.
     *
     * @param id                    the ID of the product category to update
     * @param newProductCategoryDTO the product category data to update
     * @return A ResponseEntity containing the updated product category, or a not found status if no product category is found, or an internal server error if an exception occurs.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductCategoryDTO> updateProductCategory(@PathVariable Long id, @RequestBody NewProductCategoryDTO newProductCategoryDTO) {
        try {
            return productCategoryRepository.findById(id)
                    .map(existingCategory -> {
                        existingCategory.setName(newProductCategoryDTO.getName());
                        existingCategory.setDescription(newProductCategoryDTO.getDescription());
                        return ResponseEntity.ok(toDto(productCategoryRepository.save(existingCategory)));
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<ProductCategoryDTO> createProductCategory(@RequestBody NewProductCategoryDTO newProductCategoryDTO) {
        try {
            ProductCategory productCategory = new ProductCategory();
            productCategory.setName(newProductCategoryDTO.getName());
            productCategory.setDescription(newProductCategoryDTO.getDescription());
            return ResponseEntity.ok(toDto(productCategoryRepository.save(productCategory)));
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        try {
            productCategoryRepository.deleteById(id);
            return ResponseEntity.ok("Successfully deleted");

        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Maps data from ProductCategory to ProductCategoryDTO.
     *
     * @param productCategory the ProductCategory entity
     * @return a new instance of ProductCategoryDTO with mapped data
     */
    private ProductCategoryDTO toDto(ProductCategory productCategory) {
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
