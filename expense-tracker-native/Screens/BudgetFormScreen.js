import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeInput } from "../ReusableUIComponents/NativeInput";
import { NativeSelect } from "../ReusableUIComponents/NativeSelect";
import { NativeButton } from "../ReusableUIComponents/NativeButton";
import { AuthContext } from "../context/AuthContext";
import { apiCall } from "../services/API";
import { API_BASE_URL } from "../config"; // Ensure this points to your API base URL
import { NativeLoadingSpinner } from "../ReusableUIComponents/NativeLoadingSpinner";

export const BudgetFormScreen = ({ navigation }) => {
  const { getAuthHeaders } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: new Date().getFullYear() - 2 + i,
    label: String(new Date().getFullYear() - 2 + i),
  }));

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
    fetchCategories();
  }, [getAuthHeaders]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const budgetData = {
      amount: parseFloat(amount),
      month: parseInt(month),
      year: parseInt(year),
    };

    try {
      await apiCall(
        `${API_BASE_URL}/budgets?categoryId=${categoryId}`,
        "POST",
        budgetData,
        getAuthHeaders()
      );
      navigation.goBack();
    } catch (err) {
      setError(
        err.message ||
          "Failed to set budget. A budget for this category/month might already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screenContainerScroll}>
      <NativeCard title="Set New Budget">
        {loading && <NativeLoadingSpinner />}
        {error && <NativeErrorMessage message={error} />}

        {!loading && (
          <View>
            <NativeSelect
              label="Category"
              selectedValue={categoryId}
              onValueChange={setCategoryId}
              options={categories}
            />
            <NativeInput
              label="Budget Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g., 500.00"
              keyboardType="numeric"
            />
            <NativeSelect
              label="Month"
              selectedValue={month}
              onValueChange={setMonth}
              options={monthOptions}
            />
            <NativeSelect
              label="Year"
              selectedValue={year}
              onValueChange={setYear}
              options={yearOptions}
            />
            <View style={styles.formButtonGroup}>
              <NativeButton
                onPress={handleSubmit}
                disabled={loading}
                style={styles.formSubmitButton}
              >
                Set Budget
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

const styles = StyleSheet.create({
  formSubmitButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  secondaryButton: {
    backgroundColor: "#ccc",
  },
});
