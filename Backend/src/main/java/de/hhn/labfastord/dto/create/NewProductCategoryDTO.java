package de.hhn.labfastord.dto.create;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewProductCategoryDTO {

    private String name;
    private String description;

    public NewProductCategoryDTO() {}
}
