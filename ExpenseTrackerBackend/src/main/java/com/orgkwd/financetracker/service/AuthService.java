package com.orgkwd.financetracker.service;

import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException; // Import for specific exception
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Import for specific exception
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.orgkwd.financetracker.dto.LoginRequest;
import com.orgkwd.financetracker.dto.LoginResponse;
import com.orgkwd.financetracker.dto.RegisterRequest;
import com.orgkwd.financetracker.entity.User;
import com.orgkwd.financetracker.repository.UserRepository;
import com.orgkwd.financetracker.security.JwtUtil;
import com.orgkwd.financetracker.security.UserDetailsServiceImpl; // Import your UserDetailsServiceImpl

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserService userService;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                       UserRepository userRepository, PasswordEncoder passwordEncoder,
                       UserDetailsServiceImpl userDetailsService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
    }

    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        System.out.println("Registering user: " + registerRequest.getUsername());
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        // Ensure password is encoded during registration
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRoles(Set.of("ROLE_USER")); // Assign default role

        // --- Set new fields from registration request ---
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setAddress(registerRequest.getAddress());
        user.setProfilePictureUrl(registerRequest.getProfilePictureUrl());
        // --- End Set new fields ---

        return userRepository.save(user);
    }

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        System.out.println("AuthService: Attempting authentication for user: " + loginRequest.getUsername());
        try {
            // This is where Spring Security tries to authenticate using its configured providers
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (UsernameNotFoundException e) {
            System.err.println("AuthService: Authentication failed - User not found: " + loginRequest.getUsername());
            throw new RuntimeException("Invalid username or password.", e);
        } catch (BadCredentialsException e) {
            System.err.println("AuthService: Authentication failed - Bad credentials for user: " + loginRequest.getUsername());
            throw new RuntimeException("Invalid username or password.", e);
        } catch (Exception e) {
            System.err.println("AuthService: General authentication error for user: " + loginRequest.getUsername() + ": " + e.getMessage());
            throw new RuntimeException("Authentication error: " + e.getMessage(), e);
        }

        // If authentication succeeds, load user details and generate token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after authentication in database."));

        System.out.println("AuthService: Authentication successful for: " + loginRequest.getUsername());
        return new LoginResponse(jwt, user);
    }
}