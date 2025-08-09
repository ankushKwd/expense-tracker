import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { API_BASE_URL, apiCall } from "../services/API";
import LoadingSpinner from "../ReusableComponents/LoadingSpinner";
import Card from "../ReusableComponents/Card";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import Input from "../ReusableComponents/Input";
import Button from "../ReusableComponents/Button";

const Profile = ({ navigateTo }) => {
  const { user, getAuthHeaders, updateCurrentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    id: user ? user.id : "",
    username: user ? user.username : "",
    email: user ? user.email : "",
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    dateOfBirth: user && user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "", // Format for date input
    phoneNumber: user ? user.phoneNumber : "",
    address: user ? user.address : "",
    profilePictureUrl: user ? user.profilePictureUrl : "",
    password: "", // For potential password change
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  console.log("Form data:", user, formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const dataToUpdate = { ...formData };
    // Remove empty password field if not changed
    if (dataToUpdate.password === "") {
      delete dataToUpdate.password;
    }

    // Ensure date format for backend
    if (dataToUpdate.dateOfBirth) {
      try {
        const dateObj = new Date(dataToUpdate.dateOfBirth);
        if (!isNaN(dateObj.getTime())) {
          dataToUpdate.dateOfBirth = dateObj.toISOString().split("T")[0];
        } else {
          delete dataToUpdate.dateOfBirth;
        }
      } catch (err) {
        delete dataToUpdate.dateOfBirth;
      }
    }
    console.log("Updating profile with data:", dataToUpdate, formData);
    try {
      const updatedUser = await apiCall(
        `${API_BASE_URL}/users/${formData.id}`,
        "PUT",
        dataToUpdate,
        getAuthHeaders()
      );
      updateCurrentUser(updatedUser); // Update user in AuthContext and localStorage
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />; // Or redirect to login if user not in context
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card title="My Profile">
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
        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            disabled // Username often not editable directly
          />
          <Input
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="First Name"
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            label="Last Name"
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
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
          />
          <Input
            label="Address"
            id="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
          />
          <Input
            label="Profile Picture URL"
            id="profilePictureUrl"
            type="url"
            value={formData.profilePictureUrl}
            onChange={handleChange}
          />
          <Input
            label="New Password (leave blank to keep current)"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />

          <div className="flex justify-between mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
            <Button
              onClick={() => navigateTo("dashboard")}
              className="bg-gray-500 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
