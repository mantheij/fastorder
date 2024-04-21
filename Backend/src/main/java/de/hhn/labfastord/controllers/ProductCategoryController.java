package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.ProductCategoryDTO;
import de.hhn.labfastord.models.Product;
import de.hhn.labfastord.models.ProductCategory;
import de.hhn.labfastord.repositories.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/productCategories")
public class ProductCategoryController {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @GetMapping
    public List<ProductCategoryDTO> getAllProductCategories() {
        return productCategoryRepository.findAll().stream().map(this::categoryMapper).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductCategoryDTO> getProductCategoryById(@PathVariable Integer id) {
        return productCategoryRepository.findById(id)
                .map(category -> ResponseEntity.ok(categoryMapper(category)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductCategory createProductCategory(@RequestBody ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductCategory(@PathVariable Integer id) {
        productCategoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

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
