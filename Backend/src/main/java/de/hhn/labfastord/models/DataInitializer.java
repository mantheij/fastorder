package de.hhn.labfastord.models;

import de.hhn.labfastord.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    PasswordEncoder encoder;

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final TablesRepository tablesRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public DataInitializer(ProductRepository productRepository, ProductCategoryRepository categoryRepository,
                           OrderRepository orderRepository, TablesRepository tablesRepository,
                           UserRepository userRepository, RoleRepository roleRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.tablesRepository = tablesRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {

        if (userRepository.findAll().isEmpty()) {
            //add roles
            Role roleAdmin = new Role(EnumRole.ROLE_ADMIN);
            Role roleUser = new Role(EnumRole.ROLE_USER);
            roleRepository.save(roleAdmin);
            roleRepository.save(roleUser);

            //add Admin user
            User admin = new User("admin",
                    "admin@email.de",
                    encoder.encode("admin"));
            admin.setRoles(new HashSet<>(List.of(roleAdmin)));
            userRepository.save(admin);

            //add User user
            User user = new User("user",
                    "user@user.de",
                    encoder.encode("user"));
            user.setRoles(new HashSet<>(List.of(roleUser)));
            userRepository.save(user);

            //add category
            ProductCategory categoryBeer = new ProductCategory("Biere", "Alkoholische und nicht-alkoholische Biere");
            ProductCategory categorySoft = new ProductCategory("Softdrinks", "Softdrinks");
            categoryRepository.save(categoryBeer);
            categoryRepository.save(categorySoft);

            //add produkts
            Product product1 = new Product("Cola", 2.50, 50, true, categorySoft,
                    "0.33L", "cola.jpeg", "ingredients", "nutrition", "allergens");
            Product product2 = new Product("Fanta", 2.50, 50, true, categorySoft,
                    "0.33L", "fanta.jpeg", "ingredients", "nutrition", "allergens");
            Product product3 = new Product("Fanta", 4.00, 50, true, categorySoft,
                    "0.5L", "fanta.jpeg", "ingredients", "nutrition", "allergens");
            Product product4 = new Product("Fanta", 5.00, 50, true, categorySoft,
                    "1L", "fanta.jpeg", "ingredients", "nutrition", "allergens");
            Product product5 = new Product("Bier", 3.00, 50, true, categoryBeer,
                    "0.33L", "kellerbier.jpeg", "ingredients", "nutrition", "allergens");
            productRepository.saveAll(Arrays.asList(product1, product2, product3, product4, product5));

            //add tables
            Tables table1 = new Tables("1", 1, false, 200, 125);
            tablesRepository.save(table1);

            List<Tables> tablesList = new ArrayList<>();
            tablesList.add(new Tables("2", 1, false, 200, 125));
            tablesList.add(new Tables("3", 1, false, 125, 200));
            tablesList.add(new Tables("4", 1, false, 225, 125));
            tablesList.add(new Tables("5", 1, false, 125, 225));
            tablesList.add(new Tables("6", 1, false, 445, 145));
            tablesList.add(new Tables("7", 1, false, 150, 150));
            tablesList.add(new Tables("8", 1, false, 150, 150));
            tablesList.add(new Tables("9", 1, false, 120, 150));
            tablesList.add(new Tables("10", 2, false, 200, 125));
            tablesList.add(new Tables("11", 2, false, 200, 125));
            tablesList.add(new Tables("12", 2, false, 125, 200));
            tablesList.add(new Tables("13", 2, false, 125, 250));
            tablesList.add(new Tables("14", 2, false, 125, 150));
            tablesList.add(new Tables("17", 2, false, 125, 120));
            tablesList.add(new Tables("15", 2, false, 200, 120));
            tablesList.add(new Tables("16", 2, false, 200, 120));
            tablesList.add(new Tables("placeholder", 1, false, 0, 0));

            tablesRepository.saveAll(tablesList);

            //add an order
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
}
