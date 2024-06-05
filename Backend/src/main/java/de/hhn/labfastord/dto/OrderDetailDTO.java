package de.hhn.labfastord.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDetailDTO {

    private Long orderDetailId;
    private Integer quantity;
    private Double price;
    private Long productId;
    private String productName;
    private String productSize;

    public OrderDetailDTO() {}
}
