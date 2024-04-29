package de.hhn.labfastord.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductCategoryDTO {

    private Long categoryId;
    private String name;
    private String description;
    private List<Long> productsId;

    public ProductCategoryDTO() {
    }
}

