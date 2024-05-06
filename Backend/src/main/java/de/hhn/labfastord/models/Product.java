package de.hhn.labfastord.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    private String name;
    private Double price;
    private String imgName;
    private Integer quantity;
    private boolean available;
    private String sizes;
    private String allergens;
    private String ingredients;
    private String nutrition;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private ProductCategory category;

    @OnDelete(action = OnDeleteAction.SET_NULL)
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;


    public Product() {
    }

    public Product(String cola, double price, Integer quantity, boolean available,
                   ProductCategory category, String sizes, String imgName,
                   String ingredients, String nutrition, String allergens) {
        this.name = cola;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
        this.available = available;
        this.sizes = sizes;
        this.imgName = imgName;
        this.ingredients = ingredients;
        this.nutrition = nutrition;
        this.allergens = allergens;
    }
}
