package de.hhn.labfastord.dto;



import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class OrderDTO {

    private Long orderId;
    private String status;
    private String datetime;
    private Double totalPrice;

    private List<OrderDetailDTO> orderDetails;

    private Long tableId;

    public OrderDTO() {
    }
}
