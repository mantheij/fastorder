package de.hhn.labfastord.dto;

import de.hhn.labfastord.models.Product;


public class ProductDTO {
    private Integer productId;
    private String name;
    private double price;
    private boolean available;
    private Integer categoryId;

    public ProductDTO() {}

    public ProductDTO(Integer productId, String name, double price, boolean available, Integer categoryId) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.available = available;
        this.categoryId = categoryId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public ProductDTO convertToDTO(Product product) {
        return new ProductDTO(
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                product.isAvailable(),
                product.getCategory() != null ? product.getCategory().getCategoryId() : null
        );
    }




}

