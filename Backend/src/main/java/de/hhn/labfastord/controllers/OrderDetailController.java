
package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.OrderDetailDTO;
import de.hhn.labfastord.models.OrderDetail;
import de.hhn.labfastord.repositories.OrderDetailRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.List;

/**
 * The OrderDetailController class handles the web requests for managing order details.
 */
@RestController
@RequestMapping("/api/orderDetails")
public class OrderDetailController {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    /**
     * Retrieves all order details.
     *
     * @return A ResponseEntity containing a list of OrderDetailDTOs or an internal server error if exception occurs.
     */
    @GetMapping
    public ResponseEntity<List<OrderDetailDTO>> getAllOrderDetails() {
        try {
            List<OrderDetail> orderDetails = orderDetailRepository.findAll();
            return ResponseEntity.ok(orderDetails.stream().map(this::orderDetailMapper).toList());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves a specific order detail by ID.
     *
     * @param id the ID of the order detail to retrieve
     * @return A ResponseEntity containing the found OrderDetailDTO or a not found status if not present, or an internal server error if exception occurs.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderDetailById(@PathVariable Integer id) {
        try {
            return orderDetailRepository.findById(id)
                    .map(orderDetail -> ResponseEntity.ok(orderDetailMapper(orderDetail)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates an existing order detail identified by ID with provided order detail data.
     *
     * @param id             the ID of the order detail to update
     * @param orderDetailDTO the new order detail data to be applied
     * @return A ResponseEntity containing the updated order detail, or a not found status if no order detail is found, or an internal server error if exception occurs.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> updateOrderDetail(@PathVariable Integer id, @RequestBody OrderDetailDTO orderDetailDTO) {
        try {
            return orderDetailRepository.findById(id)
                    .map(existingOrderDetail -> {
                        existingOrderDetail.setQuantity(orderDetailDTO.getQuantity());
                        existingOrderDetail.setPrice(orderDetailDTO.getPrice());
                        return ResponseEntity.ok(orderDetailMapper(orderDetailRepository.save(existingOrderDetail)));
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public OrderDetail createOrderDetail(@RequestBody OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer id) {
        try {
            orderDetailRepository.deleteById(id);
            return ResponseEntity.ok("Successfully deleted");

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
    private OrderDetailDTO orderDetailMapper(OrderDetail orderDetail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderDetailId(orderDetail.getOrderDetailId());
        dto.setQuantity(orderDetail.getQuantity());
        dto.setPrice(orderDetail.getPrice());
        dto.setOrderId(orderDetail.getOrder().getOrderId());
        if (orderDetail.getProduct() != null) {
            dto.setProductId(orderDetail.getProduct().getProductId());
        } else {
            dto.setProductId(null);
        }
        return dto;
    }
}
