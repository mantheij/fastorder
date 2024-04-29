package de.hhn.labfastord.models;

import de.hhn.labfastord.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final TablesRepository tablesRepository;

    public DataInitializer(ProductRepository productRepository, ProductCategoryRepository categoryRepository, OrderRepository orderRepository, TablesRepository tablesRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.tablesRepository = tablesRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        ProductCategory category = new ProductCategory("Getränke", "Alkoholische Getränke");
        ProductCategory category2 = new ProductCategory("Getränke", "Nicht-alkoholische Getränke");
        categoryRepository.save(category);
        categoryRepository.save(category2);

        // Erstellen von Produkten
        Product product1 = new Product("Cola", 2.50, true, category);
        Product product2 = new Product("Bier", 3.00, true, category2);
        Product product3 = new Product("Fanta", 2.50, true, category);
        Product product4 = new Product("Orangensaft", 3.00, true, category);
        productRepository.saveAll(Arrays.asList(product1, product2, product3, product4));

        // Erstellen von Tischen
        Tables table1 = new Tables(1);
        tablesRepository.save(table1);

        // Erstellen von Bestellungen
        Order order = new Order();
        order.setDateTime(new Timestamp(System.currentTimeMillis()));
        order.setStatus("offen");
        order.setTable(table1);
        order.setTotalPrice(new BigDecimal("5.50"));
        orderRepository.save(order);

        // Erstellen von Bestelldetails
        OrderDetail detail = new OrderDetail();
        detail.setOrder(order);
        detail.setProduct(product3);
        detail.setQuantity(2);
        detail.setPrice(new BigDecimal("5.00"));
        order.getOrderDetails().add(detail);
        orderRepository.save(order);
    }
}
