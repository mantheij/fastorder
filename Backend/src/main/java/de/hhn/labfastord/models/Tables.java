package de.hhn.labfastord.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tables")
public class Tables {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tableId;
    @NotNull
    private String name;
    private Integer area;
    private boolean occupied;
    private Integer width;
    private Integer height;

    public Tables() {
    }

    public Tables(String name,  Integer area, boolean occupied,  Integer width,  Integer height) {
        this.name = name;
        this.area = area;
        this.occupied = occupied;
        this.width = width;
        this.height = height;
    }

}
