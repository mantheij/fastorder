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

        ProductCategory categoryBeer = new ProductCategory("Biere", "Alkoholische und nicht-alkoholische Biere");
        ProductCategory categorySoft = new ProductCategory("Softtrinks", "Softtrinks");
        categoryRepository.save(categoryBeer);
        categoryRepository.save(categorySoft);

        // Erstellen von Produkten
        Product product1 = new Product("Cola", 2.50, 50, true, categorySoft, "0.33L, 0.5L, 1L", "cola.jpeg");
        Product product2 = new Product("Fanta", 2.50, 50, true, categorySoft, "0.33L, 0.5L, 1L", "fanta.jpeg");
        Product product3 = new Product("Bier", 3.00, 50, true, categoryBeer, "0.33L, 0.5L", "kellerbier.jpeg");
        productRepository.saveAll(Arrays.asList(product1, product2, product3));

        // Erstellen von Tischen
        Tables table1 = new Tables();
        table1.setName("1");
        tablesRepository.save(table1);

        // Erstellen von Bestellungen
        Order order = new Order();
        order.setDatetime(new Date());
        order.setStatus("open");
        order.setTable(table1);
        order.setTotalPrice(10.00);
        orderRepository.save(order);
        OrderDetail detail = new OrderDetail();
        detail.setOrder(order);
        detail.setProduct(product1);
        detail.setQuantity(2);
        detail.setPrice(5.00);
        order.getOrderDetails().add(detail);
        OrderDetail detail1 = new OrderDetail();
        detail1.setOrder(order);
        detail1.setProduct(product2);
        detail1.setQuantity(2);
        detail1.setPrice(5.00);
        order.getOrderDetails().add(detail1);
        orderRepository.save(order);
    }
}
