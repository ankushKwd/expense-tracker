package com.orgkwd.financetracker.dto;

import lombok.Data;
import lombok.NoArgsConstructor; // Add this import
import lombok.AllArgsConstructor; // Add this import

@Data // Lombok: Generates getters, setters, toString, equals, hashCode (ideally)
@NoArgsConstructor // Added for completeness with Lombok
@AllArgsConstructor // Added for completeness with Lombok
public class LoginRequest {
    private String username;
    private String password;

    // Manually added getters to ensure compatibility
    // if Lombok processing is an issue in your environment.
    public String getUsername() { // <--- ADDED THIS METHOD
        return username;
    }

    public String getPassword() { // <--- ADDED THIS METHOD
        return password;
    }

    // You might also want to add setters if they are needed elsewhere
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}