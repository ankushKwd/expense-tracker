import { useState } from "react";
import { API_BASE_URL, apiCall } from "../services/API";
import Card from "../ReusableComponents/Card";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import Input from "../ReusableComponents/Input";
import Button from "../ReusableComponents/Button";

const Register = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Transform dateOfBirth to YYYY-MM-DD if it's a valid date string
    const dataToSend = { ...formData };
    if (dataToSend.dateOfBirth) {
      try {
        const dateObj = new Date(dataToSend.dateOfBirth);
        if (!isNaN(dateObj.getTime())) {
          // Check if it's a valid date
          dataToSend.dateOfBirth = dateObj.toISOString().split("T")[0];
        } else {
          delete dataToSend.dateOfBirth; // Remove if invalid
        }
      } catch (err) {
        delete dataToSend.dateOfBirth; // Remove if parsing fails
      }
    }

    try {
      await apiCall(`${API_BASE_URL}/auth/register`, "POST", dataToSend, {
        "Content-Type": "application/json",
      });
      setMessage("Registration successful! You can now login.");
      setFormData({
        // Clear form
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

  const handleLogin = () => {
    navigateTo("login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card title="Register" className="w-full max-w-md">
        {error && <ErrorMessage message={error} />}
        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{message}</span>
          </div>
        )}
        <form onSubmit={handleRegister}>
          <Input
            label="Username *"
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
          />
          <Input
            label="Email *"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          <Input
            label="Password *"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a password"
            required
          />
          <hr className="my-6 border-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Optional Profile Details
          </h3>
          <Input
            label="First Name"
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
          <Input
            label="Last Name"
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
          />
          <Input
            label="Date of Birth"
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <Input
            label="Phone Number"
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="e.g., +1234567890"
          />
          <Input
            label="Address"
            id="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />
          <Input
            label="Profile Picture URL"
            id="profilePictureUrl"
            type="url"
            value={formData.profilePictureUrl}
            onChange={handleChange}
            placeholder="e.g., https://example.com/pic.jpg"
          />

          <div className="flex items-center justify-between mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
            <Button
              onClick={handleLogin}
              className="bg-gray-500 hover:bg-gray-700"
            >
              Back to Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
