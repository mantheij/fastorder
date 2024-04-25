package de.hhn.labfastord.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {
    private Integer productId;
    private String name;
    private double price;
    private String imgName;
    private boolean available;
    private Integer quantity;
    private Integer categoryId;

    public ProductDTO() {
    }
}

