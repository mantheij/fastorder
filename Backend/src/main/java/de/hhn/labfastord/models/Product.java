package de.hhn.labfastord.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;
    private String name;
    private double price;
    private String imgName;
    private boolean available;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProductCategory category;


    public Product() {
    }

    public Product(String name, double price, boolean available, ProductCategory category) {
        this.name = name;
        this.price = price;
        this.available = available;
        this.category = category;
    }
}
