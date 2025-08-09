package com.orgkwd.financetracker.dto;

import lombok.Data;
import lombok.NoArgsConstructor; // Add this import

import java.time.LocalDate;

import lombok.AllArgsConstructor; // Add this import

@Data // Lombok: Generates getters, setters, toString, equals, hashCode (ideally)
@NoArgsConstructor // Added for completeness with Lombok
@AllArgsConstructor // Added for completeness with Lombok
public class RegisterRequest {
	
//	@NotBlank
//    @Size(min = 3, max = 20)
    private String username;
	
//	@NotBlank
//	@Size(min = 6, max = 40)
    private String password;
    
//    @NotBlank
//    @Size(max = 50)
//    @Email
    private String email;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String address;
    private String profilePictureUrl;
    
    // Manually added getters to ensure compatibility
    // if Lombok processing is an issue in your environment.
    public String getUsername() { // <--- ADDED THIS METHOD
        return username;
    }

    public String getPassword() { // <--- ADDED THIS METHOD
        return password;
    }

    public String getEmail() { // <--- ADDED THIS METHOD
        return email;
    }

    // You might also want to add setters if they are needed elsewhere,
    // though for a request DTO, they are often used only by deserialization.
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}