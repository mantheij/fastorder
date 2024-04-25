package de.hhn.labfastord.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;
    private Timestamp dateTime;
    private String status;
    private double totalPrice;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id")
    private Tables table;

    public Order() {
    }

    public Order(Integer orderId, Timestamp dateTime, String status, double totalPrice) {
        this.orderId = orderId;
        this.dateTime = dateTime;
        this.status = status;
        this.totalPrice = totalPrice;
    }
}
