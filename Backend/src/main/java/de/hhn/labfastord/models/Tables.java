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
    private Integer tableId;
    @NotNull
    private Integer number;

    public Tables() {}
    public Tables(Integer number) {
        this.number = number;
    }
}
