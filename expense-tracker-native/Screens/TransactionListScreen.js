import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeInput } from "../ReusableUIComponents/NativeInput";
import { NativeSelect } from "../ReusableUIComponents/NativeSelect";
import { NativeButton } from "../ReusableUIComponents/NativeButton";
import { NativeLoadingSpinner } from "../ReusableUIComponents/NativeLoadingSpinner";
import { AuthContext } from "../context/AuthContext";

export const TransactionListScreen = ({ navigation }) => {
  const { getAuthHeaders } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    categoryId: "",
    type: "",
  });

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const queryString = new URLSearchParams(filters).toString();
      const data = await apiCall(
        `${API_BASE_URL}/transactions?${queryString}`,
        "GET",
        null,
        getAuthHeaders()
      );
      setTransactions(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Failed to fetch categories:", err);
      setError(
        (prev) =>
          (prev ? prev + "\n" : "") + "Failed to load categories for filter."
      );
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [getAuthHeaders, filters]);

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await apiCall(
                `${API_BASE_URL}/transactions/${id}`,
                "DELETE",
                null,
                getAuthHeaders()
              );
              fetchTransactions();
            } catch (err) {
              setError(err.message || "Failed to delete transaction.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleFilterChange = (id, value) => {
    setFilters({ ...filters, [id]: value });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Transactions</Text>
      {error && <NativeErrorMessage message={error} />}

      <NativeCard style={styles.filterCard}>
        <NativeInput
          label="Start Date"
          value={filters.startDate}
          onChangeText={(val) => handleFilterChange("startDate", val)}
          keyboardType="numeric"
          placeholder="YYYY-MM-DD"
        />
        <NativeInput
          label="End Date"
          value={filters.endDate}
          onChangeText={(val) => handleFilterChange("endDate", val)}
          keyboardType="numeric"
          placeholder="YYYY-MM-DD"
        />
        <NativeSelect
          label="Category"
          selectedValue={filters.categoryId}
          onValueChange={(val) => handleFilterChange("categoryId", val)}
          options={categories}
        />
        <NativeSelect
          label="Type"
          selectedValue={filters.type}
          onValueChange={(val) => handleFilterChange("type", val)}
          options={[
            { value: "INCOME", label: "Income" },
            { value: "EXPENSE", label: "Expense" },
          ]}
        />
        <NativeButton
          onPress={() => navigation.navigate("AddTransaction")}
          style={styles.addButton}
        >
          Add Transaction
        </NativeButton>
      </NativeCard>

      {loading ? (
        <NativeLoadingSpinner />
      ) : transactions.length === 0 ? (
        <Text style={styles.noDataText}>No transactions found.</Text>
      ) : (
        <NativeCard>
          {transactions.map((txn) => (
            <View key={txn.id} style={styles.transactionListItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionListItemDate}>
                  {new Date(txn.date).toLocaleDateString()}
                </Text>
                <Text style={styles.transactionListItemDescription}>
                  {txn.description}
                </Text>
                <Text style={styles.transactionListItemCategory}>
                  Category: {txn.category ? txn.category.name : "N/A"}
                </Text>
              </View>
              <View style={styles.transactionActions}>
                <Text
                  style={[
                    styles.transactionAmount,
                    txn.type === "INCOME"
                      ? styles.incomeText
                      : styles.expenseText,
                  ]}
                >
                  {txn.type === "INCOME" ? "+" : "-"} ${txn.amount.toFixed(2)}
                </Text>
                <View style={styles.buttonGroup}>
                  <NativeButton
                    onPress={() =>
                      navigation.navigate("EditTransaction", { id: txn.id })
                    }
                    style={styles.editButton}
                    textStyle={styles.actionButtonText}
                  >
                    Edit
                  </NativeButton>
                  <NativeButton
                    onPress={() => handleDelete(txn.id)}
                    style={styles.deleteButton}
                    textStyle={styles.actionButtonText}
                  >
                    Delete
                  </NativeButton>
                </View>
              </View>
            </View>
          ))}
        </NativeCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterCard: {
    flexDirection: "column", // Changed to column for better mobile layout
    gap: 10,
  },
  transactionListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionListItemDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  transactionListItemDescription: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1f2937",
  },
  transactionListItemCategory: {
    fontSize: 13,
    color: "#4b5563",
  },
  transactionActions: {
    marginLeft: 10,
    alignItems: "flex-end",
  },
});
