package de.hhn.labfastord.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewTableDTO {

    private Integer number;
    private Integer sizex;
    private Integer sizey;
    private Integer locx;
    private Integer locy;

    public NewTableDTO() {}
}
