package de.hhn.labfastord.dto.create;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewProductDTO {
    private String name;
    private Double price;
    private String imgName;
    private Integer quantity;
    private Long productCategoryId;
    private String size;
    private String allergens;
    private String ingredients;
    private String nutrition;

    public NewProductDTO() {}
}
