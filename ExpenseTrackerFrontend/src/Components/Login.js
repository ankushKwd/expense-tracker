import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Input from "../ReusableComponents/Input";
import Card from "../ReusableComponents/Card";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import Button from "../ReusableComponents/Button";
import { API_BASE_URL, apiCall } from "../services/API";

const Login = ({ navigateTo }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await apiCall(
        `${API_BASE_URL}/auth/login`,
        "POST",
        { username, password },
        { "Content-Type": "application/json" }
      );
      if (response && response.jwtToken) {
        login(response.jwtToken, username, response.id);
        navigateTo("dashboard");
      } else {
        setError("Login failed: Invalid response from server.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigateTo("register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card title="Login" className="w-full max-w-md">
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleLogin}>
          <Input
            label="Username"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button
              onClick={handleRegister}
              className="bg-gray-500 hover:bg-gray-700"
            >
              Register
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
