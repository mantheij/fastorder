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
    private Integer sizex;
    private Integer sizey;
    private Integer locx;
    private Integer locy;

    public Tables() {
    }
}
