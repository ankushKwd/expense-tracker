import React, { useState, useEffect, createContext } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwtToken"));

  console.log("AuthProvider initialized with token:", user);
  useEffect(() => {
    if (jwtToken) {
      setIsLoggedIn(true);
      // In a real app, you'd decode JWT or call a /me endpoint to get user details
      // For simplicity, we'll assume user is logged in if token exists.
      // You can add a /api/users/me call here to fetch actual user data.
      console.log("JWT Token found, user presumed logged in.");
      // Example: fetchUserDetails(jwtToken);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [jwtToken]);

  const login = (token, username, id) => {
    localStorage.setItem("jwtToken", token);
    setJwtToken(token);
    setUser({ username: username, id: id }); // Store basic user info
    setIsLoggedIn(true);
    console.log("User logged in:", username);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setJwtToken(null);
    setUser(null);
    setIsLoggedIn(false);
    console.log("User logged out.");
  };

  const updateCurrentUser = (newUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData }));
    // Optionally, persist user data to localStorage or backend if needed
    console.log("User updated:", newUserData);
  };

  const getAuthHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    };
  };

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
