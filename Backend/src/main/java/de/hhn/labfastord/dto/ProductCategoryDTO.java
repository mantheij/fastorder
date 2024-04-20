package de.hhn.labfastord.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductCategoryDTO {

    private Integer categoryId;
    private String name;
    private String description;
    private List<Integer> productsId;

    public ProductCategoryDTO(Integer categoryId, String name, String description, List<Integer> productsId) {
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.productsId = productsId;
    }
}

