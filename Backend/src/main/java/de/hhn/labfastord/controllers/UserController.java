package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.login.PasswordChange;
import de.hhn.labfastord.repositories.UserRepository;
import de.hhn.labfastord.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    PasswordEncoder encoder;

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
                    if (user.getUsername().equals("admin")) {
                        return ResponseEntity.badRequest().build();
                    } else {
                        userRepository.delete(user);
                        return ResponseEntity.ok("User deleted successfully!");
                    }
                })
                .orElseGet(() -> ResponseEntity.badRequest().body("Error: User not found!"));
    }

    @PutMapping("/changePassword/{id}")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody PasswordChange passwordChange) {
        return userRepository.findById(id)
                .map(user -> {
                    if (authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(user.getUsername(),
                                    passwordChange.getOldPassword())).isAuthenticated()) {
                        user.setPassword(encoder.encode(passwordChange.getNewPassword()));
                        userRepository.save(user);
                        return ResponseEntity.ok("Password changed successfully!");
                    }
                    else {
                        return ResponseEntity.badRequest().build();
                    }
                })
                .orElseGet(() -> ResponseEntity
                        .badRequest()
                        .body("Error: User not found!"));
    }

    @PutMapping("/changeUsername/{id}")
    public ResponseEntity<?> changeUsername(@PathVariable Long id, @RequestBody String newUsername) {
        if (userRepository.existsByUsername(newUsername)) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(newUsername);
                    userRepository.save(user);
                    return ResponseEntity.ok("Username changed successfully!");
                })
                .orElseGet(() -> ResponseEntity
                        .badRequest()
                        .body("Error: User not found!"));
    }

    //Noch nicht Funktional, durchgänge response 401 "Unauthorized"
    /*
    @PutMapping("/changeRole/{id}")
    public ResponseEntity<?> changeRole(@PathVariable Long id, @RequestBody EnumRole newRole) {
        return userRepository.findById(id)
                .map(user -> {
                    Set<Role> roles = new HashSet<>();
                    roles.add(new Role(newRole));
                    user.setRoles(roles);
                    userRepository.save(user);
                    return ResponseEntity.ok("Role changed successfully!");
                })
                .orElseGet(() -> ResponseEntity
                        .badRequest()
                        .body("Error: User not found!"));
    }
     */
}
