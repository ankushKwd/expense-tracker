import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeSelect } from "../ReusableUIComponents/NativeSelect";
import { NativeButton } from "../ReusableUIComponents/NativeButton";
import { AuthContext } from "../context/AuthContext";
import { apiCall } from "../services/API";
import { API_BASE_URL } from "../config"; // Ensure this points to your API base URL
import { NativeLoadingSpinner } from "../ReusableUIComponents/NativeLoadingSpinner";

export const BudgetListScreen = ({ navigation }) => {
  const { getAuthHeaders } = useContext(AuthContext);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [spendingByCategory, setSpendingByCategory] = useState({});

  const fetchBudgetsAndSpending = async () => {
    setLoading(true);
    setError("");
    try {
      const budgetData = await apiCall(
        `${API_BASE_URL}/budgets?month=${month}&year=${year}`,
        "GET",
        null,
        getAuthHeaders()
      );
      setBudgets(budgetData || []);

      const firstDayOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDayOfMonth = `${year}-${String(month).padStart(
        2,
        "0"
      )}-${new Date(year, month, 0).getDate()}`;
      const spendingData = await apiCall(
        `${API_BASE_URL}/reports/spending-by-category?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`,
        "GET",
        null,
        getAuthHeaders()
      );
      setSpendingByCategory(spendingData);
    } catch (err) {
      setError(err.message || "Failed to fetch budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetsAndSpending();
  }, [getAuthHeaders, month, year]);

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Budget",
      "Are you sure you want to delete this budget?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await apiCall(
                `${API_BASE_URL}/budgets/${id}`,
                "DELETE",
                null,
                getAuthHeaders()
              );
              fetchBudgetsAndSpending();
            } catch (err) {
              setError(err.message || "Failed to delete budget.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: new Date().getFullYear() - 2 + i,
    label: String(new Date().getFullYear() - 2 + i),
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Budgets</Text>
      {error && <NativeErrorMessage message={error} />}

      <NativeCard style={styles.filterCard}>
        <NativeSelect
          label="Month"
          selectedValue={month}
          onValueChange={(val) => setMonth(parseInt(val))}
          options={monthOptions}
        />
        <NativeSelect
          label="Year"
          selectedValue={year}
          onValueChange={(val) => setYear(parseInt(val))}
          options={yearOptions}
        />
        <NativeButton
          onPress={() => navigation.navigate("AddBudget")}
          style={styles.addButton}
        >
          Set New Budget
        </NativeButton>
      </NativeCard>

      {loading ? (
        <NativeLoadingSpinner />
      ) : budgets.length === 0 ? (
        <Text style={styles.noDataText}>
          No budgets set for{" "}
          {monthOptions.find((o) => o.value === month)?.label} {year}.
        </Text>
      ) : (
        <NativeCard>
          {budgets.map((budget) => {
            const categorySpending =
              spendingByCategory[budget.category?.name || "Uncategorized"] || 0;
            const spent = parseFloat(categorySpending);
            const progress = (spent / parseFloat(budget.amount)) * 100;
            const progressBarColor = progress > 100 ? "#ef4444" : "#22c55e";
            const remaining = parseFloat(budget.amount) - spent;

            return (
              <View key={budget.id} style={styles.budgetItem}>
                <View style={styles.budgetHeader}>
                  <Text style={styles.budgetCategory}>
                    {budget.category ? budget.category.name : "N/A"}
                  </Text>
                  <Text style={styles.budgetText}>
                    ${budget.amount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.budgetHeader}>
                  <Text style={styles.budgetText}>
                    Spent: ${spent.toFixed(2)}
                  </Text>
                  <Text style={styles.budgetText}>
                    {progress.toFixed(0)}% (
                    {remaining >= 0
                      ? `$${remaining.toFixed(2)} left`
                      : `$${Math.abs(remaining).toFixed(2)} over`}
                    )
                  </Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: progressBarColor,
                      },
                    ]}
                  />
                </View>
                <View style={styles.buttonGroup}>
                  {/* Note: Edit budget functionality needs backend /budgets/{id} GET endpoint for pre-filling */}
                  <NativeButton
                    onPress={() =>
                      Alert.alert(
                        "Edit Budget",
                        "Editing is not fully supported without a backend GET /budgets/{id} endpoint."
                      )
                    }
                    style={styles.editButton}
                    textStyle={styles.actionButtonText}
                  >
                    Edit
                  </NativeButton>
                  <NativeButton
                    onPress={() => handleDelete(budget.id)}
                    style={styles.deleteButton}
                    textStyle={styles.actionButtonText}
                  >
                    Delete
                  </NativeButton>
                </View>
              </View>
            );
          })}
        </NativeCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({});
