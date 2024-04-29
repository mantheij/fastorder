package de.hhn.labfastord.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

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
    private List<String> size = new ArrayList<>();

    public ProductDTO() {
    }
}

