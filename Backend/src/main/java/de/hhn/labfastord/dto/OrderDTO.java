package de.hhn.labfastord.dto;



import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

import java.util.List;

@Getter
@Setter
public class OrderDTO {

    private Integer orderId;
    private Timestamp dateTime;
    private String status;
    private double totalPrice;

    private List<Integer> orderDetailsIds;

    private Integer tableId;

    public OrderDTO() {
    }
}
