import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeInput } from "../ReusableUIComponents/NativeInput";
import { AuthContext } from "../context/AuthContext";
import { apiCall } from "../services/API";
import { API_BASE_URL } from "../config"; // Ensure this points to your API base URL
import { NativeLoadingSpinner } from "../ReusableUIComponents/NativeLoadingSpinner";

export const ReportViewScreen = () => {
  const { getAuthHeaders } = useContext(AuthContext);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [spendingByCategory, setSpendingByCategory] = useState({});
  const [incomeVsExpense, setIncomeVsExpense] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const spendingData = await apiCall(
        `${API_BASE_URL}/reports/spending-by-category?startDate=${startDate}&endDate=${endDate}`,
        "GET",
        null,
        getAuthHeaders()
      );
      setSpendingByCategory(spendingData);

      const incomeExpenseData = await apiCall(
        `${API_BASE_URL}/reports/income-vs-expense-trends?startDate=${startDate}&endDate=${endDate}&periodType=monthly`,
        "GET",
        null,
        getAuthHeaders()
      );
      setIncomeVsExpense(incomeExpenseData);
    } catch (err) {
      setError(err.message || "Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate, getAuthHeaders]);

  const spendingChartData = Object.keys(spendingByCategory)
    .map((cat) => ({
      name: cat,
      value: parseFloat(spendingByCategory[cat]),
    }))
    .filter((data) => data.value > 0);

  const incomeExpenseChartData = Object.keys(incomeVsExpense)
    .sort()
    .map((period) => ({
      period: period,
      income: parseFloat(incomeVsExpense[period]?.income || 0),
      expense: parseFloat(incomeVsExpense[period]?.expense || 0),
    }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Reports & Analytics</Text>
      {error && <NativeErrorMessage message={error} />}

      <NativeCard style={styles.filterCard}>
        <NativeInput
          label="Start Date"
          value={startDate}
          onChangeText={setStartDate}
          keyboardType="numeric"
          placeholder="YYYY-MM-DD"
        />
        <NativeInput
          label="End Date"
          value={endDate}
          onChangeText={setEndDate}
          keyboardType="numeric"
          placeholder="YYYY-MM-DD"
        />
      </NativeCard>

      {loading ? (
        <NativeLoadingSpinner />
      ) : (
        <>
          <NativeCard title="Spending by Category">
            {spendingChartData.length > 0 ? (
              // Placeholder for Pie Chart. Use a mobile charting library.
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>
                  [Pie Chart Placeholder] A mobile charting library is needed
                  here.
                </Text>
                {spendingChartData.map((data, index) => (
                  <Text key={index}>
                    {data.name}: ${data.value.toFixed(2)}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>
                No spending data for the selected period.
              </Text>
            )}
          </NativeCard>

          <NativeCard title="Income vs. Expense Trends (Monthly)">
            {incomeExpenseChartData.length > 0 ? (
              // Placeholder for Bar Chart. Use a mobile charting library.
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>
                  [Bar Chart Placeholder] A mobile charting library is needed
                  here.
                </Text>
                {incomeExpenseChartData.map((data, index) => (
                  <Text key={index}>
                    {data.period}: Income ${data.income.toFixed(2)}, Expense $
                    {data.expense.toFixed(2)}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>
                No income or expense data for the selected period.
              </Text>
            )}
          </NativeCard>

          <NativeCard title="Spending Trends Over Time">
            {incomeExpenseChartData.length > 0 ? (
              // Placeholder for Line Chart. Use a mobile charting library.
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>
                  [Line Chart Placeholder] A mobile charting library is needed
                  here.
                </Text>
                {incomeExpenseChartData.map((data, index) => (
                  <Text key={index}>
                    {data.period}: Expense ${data.expense.toFixed(2)}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>
                No data to show spending trends.
              </Text>
            )}
          </NativeCard>
        </>
      )}
    </ScrollView>
  );
};
