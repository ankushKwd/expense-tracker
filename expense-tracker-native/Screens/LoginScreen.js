import { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { NativeInput } from "../ReusableUIComponents/NativeInput";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeButton } from "../ReusableUIComponents/NativeButton";
import { AuthContext } from "../context/AuthContext";
import { apiCall } from "../services/API";
import { API_BASE_URL } from "../config";

export const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoggedIn } = useContext(AuthContext);

  const handleLogin = async () => {
    console.log("Login attempt with:", { username, password }, API_BASE_URL);
    setLoading(true);
    setError("");
    try {
      const response = await apiCall(
        `${API_BASE_URL}/auth/login`,
        "POST",
        { username, password },
        { "Content-Type": "application/json" }
      );
      console.log("Login response:", response);
      if (response && response.jwtToken) {
        const userProfile = await apiCall(
          `${API_BASE_URL}/users/me`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response.jwtToken}`,
          }
        );
        console.log("User profile fetched:", userProfile);
        if (userProfile) {
          console.log("User profile successfully fetched:", userProfile);
          await login(response.jwtToken, userProfile);
          console.log("Login successful, user profile set."); // Navigation handled by App.js based on AuthContext isLoggedIn
        } else {
          setError("Login successful, but failed to fetch user profile.");
        }
      } else {
        setError("Login failed: Invalid response from server.");
      }
    } catch (err) {
      console.log("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <NativeCard title="Login" style={styles.authCard}>
        {error && <NativeErrorMessage message={error} />}
        <NativeInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
        <NativeInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
        <NativeButton
          onPress={handleLogin}
          disabled={loading}
          style={styles.authButton}
        >
          {loading ? "Logging in..." : "Login"}
        </NativeButton>
        <NativeButton
          onPress={() => navigation.navigate("Register")}
          style={[styles.authButton, styles.secondaryButton]}
        >
          Register
        </NativeButton>
      </NativeCard>
    </View>
  );
};

const styles = StyleSheet.create({});
