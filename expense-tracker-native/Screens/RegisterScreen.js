import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeInput } from "../ReusableUIComponents/NativeInput";
import { NativeButton } from "../ReusableUIComponents/NativeButton";
import { apiCall } from "../services/API";
import { API_BASE_URL } from "../config"; // Ensure this points to your API base URL

export const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "", // YYYY-MM-DD
    phoneNumber: "",
    address: "",
    profilePictureUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const dataToSend = { ...formData };
    // Simple date validation for YYYY-MM-DD, more robust solutions might use date pickers
    if (
      dataToSend.dateOfBirth &&
      !/^\d{4}-\d{2}-\d{2}$/.test(dataToSend.dateOfBirth)
    ) {
      setError("Date of Birth must be in YYYY-MM-DD format.");
      setLoading(false);
      return;
    }

    try {
      await apiCall(`${API_BASE_URL}/auth/register`, "POST", dataToSend, {
        "Content-Type": "application/json",
      });
      setMessage("Registration successful! You can now login.");
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phoneNumber: "",
        address: "",
        profilePictureUrl: "",
      });
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screenContainerScroll}>
      <NativeCard title="Register" style={styles.authCard}>
        {error && <NativeErrorMessage message={error} />}
        {message && (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessageText}>Success! {message}</Text>
          </View>
        )}
        <NativeInput
          label="Username *"
          value={formData.username}
          onChangeText={(val) => handleChange("username", val)}
          placeholder="Choose a username"
        />
        <NativeInput
          label="Email *"
          value={formData.email}
          onChangeText={(val) => handleChange("email", val)}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <NativeInput
          label="Password *"
          value={formData.password}
          onChangeText={(val) => handleChange("password", val)}
          placeholder="Choose a password"
          secureTextEntry
        />

        <View style={styles.separator} />
        <Text style={styles.sectionTitle}>Optional Profile Details</Text>

        <NativeInput
          label="First Name"
          value={formData.firstName}
          onChangeText={(val) => handleChange("firstName", val)}
          placeholder="Enter your first name"
        />
        <NativeInput
          label="Last Name"
          value={formData.lastName}
          onChangeText={(val) => handleChange("lastName", val)}
          placeholder="Enter your last name"
        />
        <NativeInput
          label="Date of Birth (YYYY-MM-DD)"
          value={formData.dateOfBirth}
          onChangeText={(val) => handleChange("dateOfBirth", val)}
          placeholder="e.g., 1990-01-15"
          keyboardType="numeric"
        />
        <NativeInput
          label="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(val) => handleChange("phoneNumber", val)}
          placeholder="e.g., +1234567890"
          keyboardType="phone-pad"
        />
        <NativeInput
          label="Address"
          value={formData.address}
          onChangeText={(val) => handleChange("address", val)}
          placeholder="Enter your address"
        />
        <NativeInput
          label="Profile Picture URL"
          value={formData.profilePictureUrl}
          onChangeText={(val) => handleChange("profilePictureUrl", val)}
          placeholder="e.g., https://example.com/pic.jpg"
          keyboardType="url"
        />

        <NativeButton
          onPress={handleRegister}
          disabled={loading}
          style={styles.authButton}
        >
          {loading ? "Registering..." : "Register"}
        </NativeButton>
        <NativeButton
          onPress={() => navigation.navigate("Login")}
          style={[styles.authButton, styles.secondaryButton]}
        >
          Back to Login
        </NativeButton>
      </NativeCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});
