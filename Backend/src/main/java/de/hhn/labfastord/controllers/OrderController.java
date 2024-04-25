package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.OrderDTO;
import de.hhn.labfastord.models.Order;
import de.hhn.labfastord.models.OrderDetail;
import de.hhn.labfastord.repositories.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.List;

/**
 * The OrderController class manages the web requests related to orders.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Retrieves all orders.
     * @return A ResponseEntity containing a list of OrderDTOs or an internal server error if an exception occurs.
     */
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        try {
            List<OrderDTO> orders = orderRepository.findAll().stream().map(this::orderMapper).toList();
            return ResponseEntity.ok(orders);
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves a specific order by ID.
     * @param id the ID of the order to retrieve
     * @return A ResponseEntity containing the found OrderDTO, or a not found status if not present, or an internal server error if an exception occurs.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Integer id) {
        try {
            return orderRepository.findById(id)
                    .map(order -> ResponseEntity.ok(orderMapper(order)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates an existing order identified by ID.
     * @param id the ID of the order to update
     * @param orderDTO the order data to update
     * @return A ResponseEntity containing the updated order, or a not found status if no order is found, or an internal server error if an exception occurs.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Integer id, @RequestBody OrderDTO orderDTO) {
        try {
            return orderRepository.findById(id)
                    .map(existingOrder -> {
                        existingOrder.setStatus(orderDTO.getStatus());
                        existingOrder.setTotalPrice(orderDTO.getTotalPrice());
                        return ResponseEntity.ok(orderMapper(orderRepository.save(existingOrder)));
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer id) {
        try {
            orderRepository.deleteById(id);
            return ResponseEntity.ok("Successfully deleted");

        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Maps data from Order to OrderDTO.
     * @param order the Order entity
     * @return a new instance of OrderDTO with mapped data
     */
    private OrderDTO orderMapper(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setDateTime(order.getDateTime());
        dto.setStatus(order.getStatus());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setOrderDetailsIds(order.getOrderDetails().stream()
                .map(OrderDetail::getOrderDetailId)
                .toList());
        dto.setTableId(order.getTable().getTableId());

        return dto;
    }
}
