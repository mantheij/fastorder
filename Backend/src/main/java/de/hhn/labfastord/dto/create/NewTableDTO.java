package de.hhn.labfastord.dto.create;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewTableDTO {

    private String name;
    private Integer area;
    private boolean occupied;
    private Integer width;
    private Integer height;
    public NewTableDTO() {}
}
