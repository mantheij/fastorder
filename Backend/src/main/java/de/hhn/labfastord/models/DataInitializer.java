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
            ProductCategory categoryWine = new ProductCategory("Weine", "Rot-, Weiß- und Roséweine");
            ProductCategory categoryJuice = new ProductCategory("Säfte", "Fruchtsäfte und Gemüsesäfte");
            ProductCategory categoryLongdrinks = new ProductCategory("Longdrinks", "Selbst gemischte Getränke");
            categoryRepository.save(categoryBeer);
            categoryRepository.save(categorySoft);
            categoryRepository.save(categoryWine);
            categoryRepository.save(categoryJuice);
            categoryRepository.save(categoryLongdrinks);

            //add produkts
            List<Product> productList = new ArrayList<>();
            Product product1 = new Product("Cola", 2.50, 50, true, categorySoft,
                    "0.33L", "cola.jpeg", "ingredients", "nutrition", "allergens");
            Product product2 = new Product("Fanta", 2.50, 50, true, categorySoft,
                    "0.33L", "fanta.jpeg", "ingredients", "nutrition", "allergens");
            productRepository.save(product1);
            productRepository.save(product2);

            productList.add(new Product("Fanta", 4.00, 50, true, categorySoft,
                    "0.5L", "fanta.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Fanta", 5.00, 50, true, categorySoft,
                    "1L", "fanta.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Sprite", 5.00, 50, true, categorySoft,
                    "1L", "sprite.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Cola Zero", 4.00, 50, true, categorySoft,
                    "0.5L", "cola_zero.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Heineken", 3.00, 50, true, categoryBeer,
                    "0.33L", "heineken.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Bitburger", 3.00, 50, true, categoryBeer,
                    "0.33L", "bitburger.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("White wine", 10.00, 30, true, categoryWine,
                    "0.75L", "white_wine.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Red wine", 12.00, 20, true, categoryWine,
                    "0.75L", "red_wine.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Rosé wine", 11.00, 25, true, categoryWine,
                    "0.75L", "rose_wine.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Apple juice", 3.50, 40, true, categoryJuice,
                    "1L", "apple_juice.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Orange juice", 4.00, 35, true, categoryJuice,
                    "1L", "orange_juice.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Grape juice", 4.50, 25, true, categoryJuice,
                    "1L", "grape_juice.jpeg", "ingredients", "nutrition", "allergens"));
            productList.add(new Product("Gin Tonic", 8.00, 50, true, categoryLongdrinks,
                    "0.33L", "gin_tonic.jpeg", "gin, tonic water, ice", "nutrition", "allergens"));
            productList.add(new Product("Vodka Lemon", 7.50, 50, true, categoryLongdrinks,
                    "0.33L", "vodka_lemon.jpeg", "vodka, lemon juice, ice", "nutrition", "allergens"));
            productList.add(new Product("Whiskey Cola", 8.00, 50, true, categoryLongdrinks,
                    "0.33L", "whiskey_cola.jpeg", "whiskey, cola, ice", "nutrition", "allergens"));
            productList.add(new Product("Rum Cola", 7.50, 50, true, categoryLongdrinks,
                    "0.33L", "rum_cola.jpeg", "rum, cola, ice", "nutrition", "allergens"));
            productList.add(new Product("Tequila Sunrise", 9.00, 50, true, categoryLongdrinks,
                    "0.33L", "tequila_sunrise.jpeg", "tequila, orange juice, grenadine, ice", "nutrition", "allergens"));
            productRepository.saveAll(productList);

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
            tablesList.add(new Tables("15", 2, false, 200, 120));
            tablesList.add(new Tables("16", 2, false, 200, 120));
            tablesList.add(new Tables("17", 2, false, 125, 120));
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
