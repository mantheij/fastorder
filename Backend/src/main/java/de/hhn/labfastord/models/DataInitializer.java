package de.hhn.labfastord.models;

import de.hhn.labfastord.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;

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
    public void run(String... args) {

        ProductCategory category = new ProductCategory("Getränke", "Alkoholische und nicht-alkoholische Getränke");
        categoryRepository.save(category);

        // Erstellen von Produkten
        Product product1 = new Product("Cola", 2.50, true, category);
        Product product2 = new Product("Bier", 3.00, true, category);
        productRepository.saveAll(Arrays.asList(product1, product2));

        // Erstellen von Tischen
        Tables table1 = new Tables();
        table1.setNumber(1);
        tablesRepository.save(table1);

        // Erstellen von Bestellungen
        Order order = new Order();
        order.setDatetime(new Date());
        order.setStatus("offen");
        order.setTable(table1);
        order.setTotalPrice(5.50);
        orderRepository.save(order);

        // Erstellen von Bestelldetails
        OrderDetail detail = new OrderDetail();
        detail.setOrder(order);
        detail.setProduct(product1);
        detail.setQuantity(2);
        detail.setPrice(5.00);
        order.getOrderDetails().add(detail);
        orderRepository.save(order);
    }
}
