import React, { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, Text } from "react-native";
import { API_BASE_URL } from "../config";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load auth data from AsyncStorage on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("jwtToken");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken) {
          setJwtToken(storedToken);
          setIsLoggedIn(true); // <-- Set isLoggedIn to true immediately after finding token

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // Optionally, fetch user details from /me endpoint to ensure fresh data
          try {
            const authHeaders = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            };
            const currentUser = await apiCall(
              `${API_BASE_URL}/users/me`,
              "GET",
              null,
              authHeaders
            );
            if (currentUser) {
              setUser(currentUser);
              await AsyncStorage.setItem("user", JSON.stringify(currentUser));
            } else {
              console.warn(
                "Failed to fetch user details with stored token. Logging out."
              );
              logout(); // This will set isLoggedIn to false
            }
          } catch (fetchError) {
            console.error(
              "Error fetching user details after load:",
              fetchError
            );
            logout(); // This will set isLoggedIn to false
          }
        }
      } catch (e) {
        console.error("Failed to load auth data from AsyncStorage", e);
      } finally {
        setAuthLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const login = async (token, userObject) => {
    try {
      console.log("Logging in user:", userObject);
      await AsyncStorage.setItem("jwtToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(userObject));
      setJwtToken(token);
      setIsLoggedIn(true); // <-- This is crucial! Ensure it sets true after successful login
      setUser(userObject);
      console.log("User logged in:", userObject.username);
    } catch (e) {
      console.error("Failed to save auth data to AsyncStorage", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken");
      await AsyncStorage.removeItem("user");
      setJwtToken(null);
      setUser(null);
      setIsLoggedIn(false); // <-- Set to false on logout
      console.log("User logged out.");
    } catch (e) {
      console.error("Failed to clear auth data from AsyncStorage", e);
    }
  };

  const getAuthHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    };
  };

  const updateCurrentUser = async (updatedUserData) => {
    try {
      setUser(updatedUserData);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUserData));
    } catch (e) {
      console.error("Failed to update user data in AsyncStorage", e);
    }
  };

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading application...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        jwtToken,
        login,
        logout,
        getAuthHeaders,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
