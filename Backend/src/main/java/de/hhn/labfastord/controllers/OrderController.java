package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.OrderDTO;
import de.hhn.labfastord.dto.OrderDetailDTO;
import de.hhn.labfastord.dto.create.NewOrderDTO;
import de.hhn.labfastord.models.Order;
import de.hhn.labfastord.models.OrderDetail;
import de.hhn.labfastord.repositories.OrderRepository;
import de.hhn.labfastord.repositories.ProductRepository;
import de.hhn.labfastord.repositories.TablesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * The OrderController class manages the web requests related to orders.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TablesRepository tablesRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Gets all orders.
     *
     * @return all orders as ResponseEntity.
     */
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        try {
            List<OrderDTO> orders = orderRepository.findAll().stream().map(this::toDto).toList();
            return ResponseEntity.ok(orders);
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Gets all orders with status open.
     *
     * @return all orders as ResponseEntity.
     */
    @GetMapping("/open")
    public ResponseEntity<List<OrderDTO>> getAllOpenOrders() {
        try {
            List<OrderDTO> orders = orderRepository.findAll().stream()
                    .filter(order -> order.getStatus().equals("open"))
                    .map(this::toDto).toList();
            return ResponseEntity.ok(orders);
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Gets an order by ID.
     *
     * @param id the order ID.
     * @return the order as ResponseEntity.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        try {
            return orderRepository.findById(id).map(order -> ResponseEntity.ok(toDto(order)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates order status.
     *
     * @param id       the order ID.
     * @param orderDTO the order data.
     * @return updated order as ResponseEntity.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        try {
            return orderRepository.findById(id).map(existingOrder -> {
                existingOrder.setStatus(orderDTO.getStatus());
                return ResponseEntity.ok(toDto(orderRepository.save(existingOrder)));
            }).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Creates a new order.
     *
     * @param newOrderDTO the new order data.
     * @return the created order as ResponseEntity.
     */
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody NewOrderDTO newOrderDTO) {
        try {
            Order order = new Order();
            order.setStatus("open");
            order.setDatetime(new Date());
            order.setTable(tablesRepository.findById(newOrderDTO.getTableId())
                    .orElseThrow(NullPointerException::new));
            orderRepository.save(order);

            for (OrderDetail orderDetail : newOrderDTO.getOrderDetails()) {
                OrderDetail newOrderDetail = new OrderDetail();
                newOrderDetail.setOrder(order);
                newOrderDetail.setProduct(orderDetail.getProduct());
                newOrderDetail.setQuantity(orderDetail.getQuantity());
                Double price = productRepository.findById(orderDetail.getProduct().getProductId())
                        .map(product -> orderDetail.getQuantity() * product.getPrice())
                        .orElseThrow(NullPointerException::new);
                newOrderDetail.setPrice(price);
                order.getOrderDetails().add(newOrderDetail);
                order.setTotalPrice(order.getTotalPrice() + newOrderDetail.getPrice());
            }
            orderRepository.save(order);
            return ResponseEntity.ok(toDto(order));
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        } catch (NullPointerException e) {
            return ResponseEntity.badRequest().build();
        }

    }


    /**
     * Deletes an order.
     *
     * @param id the order ID.
     * @return a confirmation message as ResponseEntity.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        try {
            orderRepository.deleteById(id);
            return ResponseEntity.ok("Successfully deleted");

        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Maps data from Order to OrderDTO.
     *
     * @param order the Order entity
     * @return a new instance of OrderDTO with mapped data
     */
    private OrderDTO toDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setStatus(order.getStatus());
        dto.setDatetime(order.getDatetime().toString());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setOrderDetails(order.getOrderDetails().stream()
                .map(orderDetail -> {
                    OrderDetailDTO orderDetailDTO = new OrderDetailDTO();
                    orderDetailDTO.setOrderDetailId(orderDetail.getOrderDetailId());
                    orderDetailDTO.setQuantity(orderDetail.getQuantity());
                    orderDetailDTO.setPrice(orderDetail.getPrice());
                    if (orderDetail.getProduct() != null) {
                        orderDetailDTO.setProductId(orderDetail.getProduct().getProductId());
                        orderDetailDTO.setProductName(orderDetail.getProduct().getName());
                    } else {
                        orderDetailDTO.setProductId(null);
                        orderDetailDTO.setProductName(null);
                    }
                    return orderDetailDTO;
                }).toList());
        if (order.getTable() != null) {
            dto.setTableId(order.getTable().getTableId());
        } else {
            dto.setTableId(null);
        }
        return dto;
    }
}
