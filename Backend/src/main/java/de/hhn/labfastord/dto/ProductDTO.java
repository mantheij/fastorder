package de.hhn.labfastord.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {
    private Long productId;
    private String name;
    private Double price;
    private String imgName;
    private boolean available;
    private Integer quantity;
    private Long categoryId;

    public ProductDTO() {
    }
}

