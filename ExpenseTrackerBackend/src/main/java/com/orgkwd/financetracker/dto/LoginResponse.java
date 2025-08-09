// src/main/java/com/orgkwd/financetracker/dto/LoginResponse.java
package com.orgkwd.financetracker.dto;

import com.orgkwd.financetracker.entity.User; // Import the User entity

public class LoginResponse {
    private String jwtToken;
    private Long id;
    private String username;
    private String email;
    // Add other user profile fields you might want to send back on login
    private String firstName;
    private String lastName;
    // Note: Do NOT include password or sensitive fields like roles directly unless necessary
    // for specific frontend logic and handled carefully.

    // Constructor
    public LoginResponse(String jwtToken, User user) {
        this.jwtToken = jwtToken;
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        // You can add more fields from the User object if needed by the frontend upon login.
    }

    // Getters and Setters
    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}