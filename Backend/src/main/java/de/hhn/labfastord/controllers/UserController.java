package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.login.MessageResponse;
import de.hhn.labfastord.repositories.UserRepository;
import de.hhn.labfastord.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (user.getUsername().equals("admin")){
                        return ResponseEntity.badRequest().build();
                    } else {
                        userRepository.delete(user);
                        return ResponseEntity.ok("User deleted successfully!");
                    }
                })
                .orElseGet(() -> ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: User not found!")));
    }
}
