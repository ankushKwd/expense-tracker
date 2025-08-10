import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeInput } from "../ReusableUIComponents/NativeInput";
import { NativeButton } from "../ReusableUIComponents/NativeButton";
import { AuthContext } from "../context/AuthContext";
import { apiCall } from "../services/API";
import { API_BASE_URL } from "../config"; // Ensure this points to your API base URL

export const UserProfileScreen = ({ navigation }) => {
  const { user, getAuthHeaders, updateCurrentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    id: user ? user.id : "",
    username: user ? user.username : "",
    email: user ? user.email : "",
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    dateOfBirth: user && user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
    phoneNumber: user ? user.phoneNumber : "",
    address: user ? user.address : "",
    profilePictureUrl: user ? user.profilePictureUrl : "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        profilePictureUrl: user.profilePictureUrl || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const dataToUpdate = { ...formData };
    if (dataToUpdate.password === "") {
      delete dataToUpdate.password;
    }
    if (
      dataToUpdate.dateOfBirth &&
      !/^\d{4}-\d{2}-\d{2}$/.test(dataToUpdate.dateOfBirth)
    ) {
      setError("Date of Birth must be in YYYY-MM-DD format.");
      setLoading(false);
      return;
    }

    try {
      const updatedUser = await apiCall(
        `${API_BASE_URL}/users/${formData.id}`,
        "PUT",
        dataToUpdate,
        getAuthHeaders()
      );
      updateCurrentUser(updatedUser);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <NativeLoadingSpinner />;
  }

  return (
    <ScrollView contentContainerStyle={styles.screenContainerScroll}>
      <NativeCard title="My Profile" style={styles.profileCard}>
        {error && <NativeErrorMessage message={error} />}
        {message && (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessageText}>Success! {message}</Text>
          </View>
        )}
        {formData.profilePictureUrl ? (
          <Image
            source={{ uri: formData.profilePictureUrl }}
            style={styles.profilePicture}
          />
        ) : (
          <View style={styles.profilePicturePlaceholder}>
            <Text style={styles.profilePicturePlaceholderText}>No Pic</Text>
          </View>
        )}
        <NativeInput
          label="Username"
          value={formData.username}
          editable={false}
        />
        <NativeInput
          label="Email"
          value={formData.email}
          onChangeText={(val) => handleChange("email", val)}
          keyboardType="email-address"
        />
        <NativeInput
          label="First Name"
          value={formData.firstName}
          onChangeText={(val) => handleChange("firstName", val)}
        />
        <NativeInput
          label="Last Name"
          value={formData.lastName}
          onChangeText={(val) => handleChange("lastName", val)}
        />
        <NativeInput
          label="Date of Birth (YYYY-MM-DD)"
          value={formData.dateOfBirth}
          onChangeText={(val) => handleChange("dateOfBirth", val)}
          keyboardType="numeric"
        />
        <NativeInput
          label="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(val) => handleChange("phoneNumber", val)}
          keyboardType="phone-pad"
        />
        <NativeInput
          label="Address"
          value={formData.address}
          onChangeText={(val) => handleChange("address", val)}
        />
        <NativeInput
          label="Profile Picture URL"
          value={formData.profilePictureUrl}
          onChangeText={(val) => handleChange("profilePictureUrl", val)}
          keyboardType="url"
        />
        <NativeInput
          label="New Password (leave blank to keep current)"
          value={formData.password}
          onChangeText={(val) => handleChange("password", val)}
          secureTextEntry
        />

        <NativeButton
          onPress={handleSubmit}
          disabled={loading}
          style={styles.profileSaveButton}
        >
          {loading ? "Saving..." : "Save Profile"}
        </NativeButton>
        <NativeButton
          onPress={() => navigation.goBack()}
          style={[styles.profileSaveButton, styles.secondaryButton]}
        >
          Cancel
        </NativeButton>
      </NativeCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderColor: "#d1d5db",
    borderWidth: 1,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#d1d5db",
    borderWidth: 1,
  },
  profilePicturePlaceholderText: {
    color: "#6b7280",
    fontSize: 14,
  },
  profileSaveButton: {
    marginTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
});
