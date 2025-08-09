import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL, apiCall } from "../services/API";
import LoadingSpinner from "../ReusableComponents/LoadingSpinner";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import Card from "../ReusableComponents/Card";

const Dashboard = () => {
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
        const month = today.getMonth() + 1; // Month is 0-indexed
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
          `${API_BASE_URL}/transactions?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`, // Backend needs to support 'top N' or date range
          "GET",
          null,
          getAuthHeaders()
        );
        // Simulate recent 5-10 transactions (backend should provide a dedicated endpoint or sort/limit)
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

  // Data for Pie Chart
  const pieChartData = Object.keys(spendingByCategory)
    .map((category) => ({
      name: category,
      value: parseFloat(spendingByCategory[category]),
    }))
    .filter((data) => data.value > 0); // Filter out zero values

  const PIE_COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF19A8",
  ];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          {/* Total Balance */}
          <Card title="Current Balance">
            <p className="text-4xl font-extrabold text-blue-600">
              ${summary?.netBalance ? summary.netBalance.toFixed(2) : "0.00"}
            </p>
            <div className="flex justify-between text-gray-600 mt-2 text-sm">
              <span>
                Total Income: $
                {summary?.totalIncome ? summary.totalIncome.toFixed(2) : "0.00"}
              </span>
              <span>
                Total Expenses: $
                {summary?.totalExpenses
                  ? summary.totalExpenses.toFixed(2)
                  : "0.00"}
              </span>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card title="Recent Transactions">
            {recentTransactions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentTransactions.map((txn) => (
                  <li
                    key={txn.id}
                    className="py-2 flex justify-between items-center text-sm"
                  >
                    <div>
                      <span
                        className={`font-semibold ${
                          txn.type === "INCOME"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {txn.type === "INCOME" ? "+" : "-"} $
                        {txn.amount.toFixed(2)}
                      </span>
                      <span className="ml-2 text-gray-700">
                        {txn.description}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {new Date(txn.date).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent transactions.</p>
            )}
          </Card>

          {/* Spending by Category Chart */}
          <Card title="Spending by Category (Current Month)">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">
                No categorized spending for this month to display a chart.
              </p>
            )}
          </Card>

          {/* Budget Progress Overview */}
          <Card title="Budget Progress (Current Month)">
            {budgets.length > 0 ? (
              <div className="space-y-4">
                {budgets.map((budget) => {
                  // Simulate actual spending for budget (in a real app, this would be computed by backend)
                  const categorySpending =
                    spendingByCategory[
                      budget.category?.name || "Uncategorized"
                    ] || 0;
                  const progress =
                    (parseFloat(categorySpending) / parseFloat(budget.amount)) *
                    100;
                  const progressBarColor =
                    progress > 100 ? "bg-red-500" : "bg-green-500";

                  return (
                    <div key={budget.id} className="text-sm">
                      <div className="flex justify-between mb-1 text-gray-700">
                        <span>{budget.category?.name || "Uncategorized"}</span>
                        <span>
                          ${parseFloat(categorySpending).toFixed(2)} / $
                          {budget.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${progressBarColor} h-2 rounded-full`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      {progress > 100 && (
                        <p className="text-xs text-red-600 mt-1">
                          Over budget by $
                          {(
                            parseFloat(categorySpending) -
                            parseFloat(budget.amount)
                          ).toFixed(2)}
                          !
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No budgets set for this month.</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
