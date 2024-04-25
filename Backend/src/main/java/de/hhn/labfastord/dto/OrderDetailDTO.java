package de.hhn.labfastord.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDetailDTO {

    private Integer orderDetailId;
    private Integer quantity;
    private Double price;
    private Integer orderId;
    private Integer productId;

    public OrderDetailDTO() {}
}
