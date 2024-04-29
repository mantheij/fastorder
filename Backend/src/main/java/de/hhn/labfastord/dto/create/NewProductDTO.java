package de.hhn.labfastord.dto.create;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class NewProductDTO {
    private String name;
    private Double price;
    private String imgName;
    private Integer quantity;
    private Long productCategoryId;
    private List<String> size = new ArrayList<>();

    public NewProductDTO() {}
}
