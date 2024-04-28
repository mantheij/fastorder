package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.create.NewProductCategoryDTO;
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
     * Gets all product categories.
     *
     * @return all product categories as ResponseEntity.
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
     * Gets a product category by ID.
     *
     * @param id the category ID.
     * @return the product category as ResponseEntity.
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
     * Updates a product category.
     *
     * @param id                    the category ID.
     * @param newProductCategoryDTO the category data.
     * @return the updated category as ResponseEntity.
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

    /**
     * Creates a new product category.
     *
     * @param newProductCategoryDTO the new category data.
     * @return the created category as ResponseEntity.
     */
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


    /**
     * Deletes a product category.
     *
     * @param id the category ID.
     * @return a confirmation message as ResponseEntity.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductCategory(@PathVariable Long id) {
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
