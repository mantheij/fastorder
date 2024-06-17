package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.login.JwtResponse;
import de.hhn.labfastord.dto.login.LoginRequest;
import de.hhn.labfastord.dto.login.SignupRequest;
import de.hhn.labfastord.models.EnumRole;
import de.hhn.labfastord.models.Role;
import de.hhn.labfastord.models.User;
import de.hhn.labfastord.repositories.RoleRepository;
import de.hhn.labfastord.repositories.UserRepository;
import de.hhn.labfastord.security.jwt.JwtUtils;
import de.hhn.labfastord.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Controller for handling authentication-related operations such as sign-in and sign-up.
 */
@CrossOrigin(origins = {"http://localhost:80", "http://react:80", "http://localhost:3000"}, maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  /**
   * Authenticates a user and returns a JWT token upon successful authentication.
   *
   * @param loginRequest The login request containing the username and password.
   * @return A ResponseEntity containing the JWT token and user details.
   */
  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles = userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt,
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles));
  }
  /**
   * Registers a new user.
   *
   * @param signUpRequest The signup request containing the username, email, password, and roles.
   * @return A ResponseEntity indicating the result of the registration.
   */
  //@PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body("Error: Username is already taken!");
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body("Error: Email is already in use!");
    }

    User user = new User(signUpRequest.getUsername(),
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(EnumRole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
          if (role.equals("admin")) {
              Role adminRole = roleRepository.findByName(EnumRole.ROLE_ADMIN)
                      .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
              roles.add(adminRole);
          } else {
              Role userRole = roleRepository.findByName(EnumRole.ROLE_USER)
                      .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
              roles.add(userRole);
          }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok("User registered successfully!");
  }
}
