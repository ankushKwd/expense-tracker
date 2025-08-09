package com.orgkwd.financetracker.controller;

import com.orgkwd.financetracker.entity.User;
import com.orgkwd.financetracker.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.orgkwd.financetracker.security.UserDetailsImpl; // <-- ADD OR CORRECT THIS IMPORT

// ... rest of your UserController class ...

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            // Cast to your specific UserDetailsImpl to access the getId() method
            UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Long authenticatedUserId = principal.getId(); // Now getId() is available

            if (!id.equals(authenticatedUserId)) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        } catch (ClassCastException e) {
             System.err.println("Error casting principal to UserDetailsImpl. It might not be authenticated with your custom UserDetails: " + e.getMessage());
             return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Or handle as appropriate
        }


        user.setId(id);
        
        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(updatedUser);
    }
}