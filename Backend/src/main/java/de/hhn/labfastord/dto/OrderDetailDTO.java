package de.hhn.labfastord.dto;



import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

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
