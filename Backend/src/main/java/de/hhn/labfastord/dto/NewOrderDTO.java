package de.hhn.labfastord.dto;

import de.hhn.labfastord.models.OrderDetail;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class NewOrderDTO {

    private List<OrderDetail> orderDetails = new ArrayList<>();

    private Long tablesId;
}
