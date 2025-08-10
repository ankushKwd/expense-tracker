import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeInput } from "../ReusableUIComponents/NativeInput";
import { AuthContext } from "../context/AuthContext";
import { apiCall } from "../services/API";
import { API_BASE_URL } from "../config"; // Ensure this points to your API base URL
import { NativeLoadingSpinner } from "../ReusableUIComponents/NativeLoadingSpinner";

export const TransactionFormScreen = ({ navigation, route }) => {
  const { id: transactionId } = route.params || {};
  const { getAuthHeaders } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiCall(
          `${API_BASE_URL}/categories`,
          "GET",
          null,
          getAuthHeaders()
        );
        setCategories(data.map((cat) => ({ value: cat.id, label: cat.name })));
      } catch (err) {
        setError(err.message || "Failed to load categories.");
      }
    };

    const fetchTransaction = async () => {
      if (transactionId) {
        setIsEditing(true);
        setLoading(true);
        try {
          const data = await apiCall(
            `${API_BASE_URL}/transactions/${transactionId}`,
            "GET",
            null,
            getAuthHeaders()
          );
          setDescription(data.description);
          setAmount(data.amount.toString()); // Convert number to string for TextInput
          setDate(data.date);
          setType(data.type);
          setCategoryId(data.category ? data.category.id : "");
        } catch (err) {
          setError(err.message || "Failed to load transaction for editing.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    fetchTransaction();
  }, [transactionId, getAuthHeaders]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const transactionData = {
      description,
      amount: parseFloat(amount),
      date,
      type,
    };

    try {
      if (isEditing) {
        await apiCall(
          `${API_BASE_URL}/transactions/${transactionId}?categoryId=${categoryId}`,
          "PUT",
          transactionData,
          getAuthHeaders()
        );
      } else {
        await apiCall(
          `${API_BASE_URL}/transactions?categoryId=${categoryId}`,
          "POST",
          transactionData,
          getAuthHeaders()
        );
      }
      navigation.goBack();
    } catch (err) {
      setError(err.message || "Failed to save transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screenContainerScroll}>
      <NativeCard
        title={isEditing ? "Edit Transaction" : "Add New Transaction"}
      >
        {loading && <NativeLoadingSpinner />}
        {error && <NativeErrorMessage message={error} />}

        {!loading && (
          <View>
            <NativeInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="e.g., Groceries, Salary"
            />
            <NativeInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g., 50.00"
              keyboardType="numeric"
            />
            <NativeInput
              label="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              keyboardType="numeric"
            />
            <NativeSelect
              label="Type"
              selectedValue={type}
              onValueChange={setType}
              options={[
                { value: "EXPENSE", label: "Expense" },
                { value: "INCOME", label: "Income" },
              ]}
            />
            <NativeSelect
              label="Category"
              selectedValue={categoryId}
              onValueChange={setCategoryId}
              options={categories}
            />
            <View style={styles.formButtonGroup}>
              <NativeButton
                onPress={handleSubmit}
                disabled={loading}
                style={styles.formSubmitButton}
              >
                {isEditing ? "Update Transaction" : "Add Transaction"}
              </NativeButton>
              <NativeButton
                onPress={() => navigation.goBack()}
                style={[styles.formSubmitButton, styles.secondaryButton]}
              >
                Cancel
              </NativeButton>
            </View>
          </View>
        )}
      </NativeCard>
    </ScrollView>
  );
};
