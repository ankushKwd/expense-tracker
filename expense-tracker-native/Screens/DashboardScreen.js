import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeLoadingSpinner } from "../ReusableUIComponents/NativeLoadingSpinner";
import { AuthContext } from "../context/AuthContext";
import { apiCall } from "../services/API";
import { API_BASE_URL } from "../config"; // Ensure this points to your API base URL

export const DashboardScreen = () => {
  const { getAuthHeaders } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [spendingByCategory, setSpendingByCategory] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const firstDayOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
        const lastDayOfMonth = `${year}-${String(month).padStart(
          2,
          "0"
        )}-${new Date(year, month, 0).getDate()}`;

        const summaryData = await apiCall(
          `${API_BASE_URL}/reports/summary?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`,
          "GET",
          null,
          getAuthHeaders()
        );
        setSummary(summaryData);

        const recentTxns = await apiCall(
          `${API_BASE_URL}/transactions?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`,
          "GET",
          null,
          getAuthHeaders()
        );
        setRecentTransactions(recentTxns ? recentTxns.slice(0, 10) : []);

        const spendingData = await apiCall(
          `${API_BASE_URL}/reports/spending-by-category?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`,
          "GET",
          null,
          getAuthHeaders()
        );
        setSpendingByCategory(spendingData);

        const budgetData = await apiCall(
          `${API_BASE_URL}/budgets?month=${month}&year=${year}`,
          "GET",
          null,
          getAuthHeaders()
        );
        setBudgets(budgetData);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getAuthHeaders]);

  // Data for Pie Chart (Recharts equivalent - actual chart lib needed)
  const pieChartData = Object.keys(spendingByCategory)
    .map((category) => ({
      name: category,
      value: parseFloat(spendingByCategory[category]),
    }))
    .filter((data) => data.value > 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Dashboard</Text>
      {loading && <NativeLoadingSpinner />}
      {error && <NativeErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <NativeCard title="Current Balance">
            <Text style={styles.balanceText}>
              ${summary?.netBalance ? summary.netBalance.toFixed(2) : "0.00"}
            </Text>
            <View style={styles.balanceDetails}>
              <Text style={styles.balanceDetailText}>
                Income: $
                {summary?.totalIncome ? summary.totalIncome.toFixed(2) : "0.00"}
              </Text>
              <Text style={styles.balanceDetailText}>
                Expenses: $
                {summary?.totalExpenses
                  ? summary.totalExpenses.toFixed(2)
                  : "0.00"}
              </Text>
            </View>
          </NativeCard>

          <NativeCard title="Recent Transactions">
            {recentTransactions.length > 0 ? (
              <View>
                {recentTransactions.map((txn) => (
                  <View key={txn.id} style={styles.transactionItem}>
                    <View>
                      <Text
                        style={[
                          styles.transactionAmount,
                          txn.type === "INCOME"
                            ? styles.incomeText
                            : styles.expenseText,
                        ]}
                      >
                        {txn.type === "INCOME" ? "+" : "-"} $
                        {txn.amount.toFixed(2)}
                      </Text>
                      <Text style={styles.transactionDescription}>
                        {txn.description}
                      </Text>
                    </View>
                    <Text style={styles.transactionDate}>
                      {new Date(txn.date).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No recent transactions.</Text>
            )}
          </NativeCard>

          <NativeCard title="Spending by Category (Current Month)">
            {pieChartData.length > 0 ? (
              // Placeholder for Pie Chart. Integrate a React Native charting library here.
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>
                  [Pie Chart Placeholder] A mobile charting library is needed
                  here.
                </Text>
                {pieChartData.map((data, index) => (
                  <Text key={index}>
                    {data.name}: ${data.value.toFixed(2)}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>
                No categorized spending for this month to display a chart.
              </Text>
            )}
          </NativeCard>

          <NativeCard title="Budget Progress (Current Month)">
            {budgets.length > 0 ? (
              <View style={styles.budgetList}>
                {budgets.map((budget) => {
                  const categorySpending =
                    spendingByCategory[
                      budget.category?.name || "Uncategorized"
                    ] || 0;
                  const progress =
                    (parseFloat(categorySpending) / parseFloat(budget.amount)) *
                    100;
                  const progressBarColor =
                    progress > 100 ? "#ef4444" : "#22c55e"; // red-500 : green-500
                  const spent = parseFloat(categorySpending);
                  const remaining = parseFloat(budget.amount) - spent;

                  return (
                    <View key={budget.id} style={styles.budgetItem}>
                      <View style={styles.budgetHeader}>
                        <Text style={styles.budgetCategory}>
                          {budget.category?.name || "Uncategorized"}
                        </Text>
                        <Text style={styles.budgetText}>
                          ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
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
                      <Text style={styles.budgetRemainingText}>
                        {progress.toFixed(0)}% (
                        {remaining >= 0
                          ? `$${remaining.toFixed(2)} left`
                          : `$${Math.abs(remaining).toFixed(2)} over`}
                        )
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.noDataText}>
                No budgets set for this month.
              </Text>
            )}
          </NativeCard>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  balanceText: {
    fontSize: 32,
    fontWeight: "800", // extrabold
    color: "#2563eb", // blue-600
    textAlign: "center",
    marginBottom: 10,
  },
  balanceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  balanceDetailText: {
    fontSize: 13,
    color: "#4b5563", // gray-600
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // gray-200
  },
  transactionAmount: {
    fontWeight: "bold",
    fontSize: 15,
  },
  incomeText: {
    color: "#16a34a", // green-600
  },
  expenseText: {
    color: "#dc2626", // red-600
  },
  transactionDescription: {
    fontSize: 14,
    color: "#374151", // gray-700
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6b7280", // gray-500
  },
  noDataText: {
    textAlign: "center",
    color: "#6b7280", // gray-500
    paddingVertical: 20,
  },
  chartPlaceholder: {
    height: 250,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    padding: 10,
  },
  chartPlaceholderText: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
  },
  budgetList: {
    marginTop: 10,
  },
  budgetItem: {
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  budgetCategory: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#374151",
  },
  budgetText: {
    fontSize: 14,
    color: "#4b5563",
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb", // gray-200
    borderRadius: 4,
    marginTop: 5,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  budgetRemainingText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 5,
  },
});
