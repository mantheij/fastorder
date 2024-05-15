
package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.OrderDetailDTO;
import de.hhn.labfastord.models.OrderDetail;
import de.hhn.labfastord.repositories.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * The OrderDetailController class handles the web requests for managing order details.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orderDetails")
public class OrderDetailController {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    /**
     * Gets all order details.
     *
     * @return all order details as ResponseEntity.
     */
    @GetMapping
    public ResponseEntity<List<OrderDetailDTO>> getAllOrderDetails() {
        try {
            List<OrderDetail> orderDetails = orderDetailRepository.findAll();
            return ResponseEntity.ok(orderDetails.stream().map(this::toDto).toList());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Gets order detail by ID.
     *
     * @param id the order detail ID.
     * @return the order detail as ResponseEntity.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderDetailById(@PathVariable Long id) {
        try {
            return orderDetailRepository.findById(id)
                    .map(orderDetail -> ResponseEntity.ok(toDto(orderDetail)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Maps data from OrderDetail to OrderDetailDTO.
     *
     * @param orderDetail the order detail entity
     * @return a new instance of OrderDetailDTO with mapped data
     */
    private OrderDetailDTO toDto(OrderDetail orderDetail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderDetailId(orderDetail.getOrderDetailId());
        dto.setQuantity(orderDetail.getQuantity());
        dto.setPrice(orderDetail.getPrice());
        if (orderDetail.getProduct() != null) {
            dto.setProductId(orderDetail.getProduct().getProductId());
            dto.setProductName(orderDetail.getProduct().getName());
        } else {
            dto.setProductId(null);
            dto.setProductName(null);
        }
        return dto;
    }
}
