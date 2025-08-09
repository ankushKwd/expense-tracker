import { useContext, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import Card from "../ReusableComponents/Card";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import Input from "../ReusableComponents/Input";
import LoadingSpinner from "../ReusableComponents/LoadingSpinner";
import { API_BASE_URL, apiCall } from "../services/API";
import { AuthContext } from "../Context/AuthContext";

const ReportView = () => {
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

  useEffect(() => {
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

    fetchReports();
  }, [startDate, endDate, getAuthHeaders]);

  // Data preparation for charts
  const spendingChartData = Object.keys(spendingByCategory)
    .map((cat) => ({
      name: cat,
      value: parseFloat(spendingByCategory[cat]),
    }))
    .filter((data) => data.value > 0); // Filter out zero values

  const incomeExpenseChartData = Object.keys(incomeVsExpense)
    .sort()
    .map((period) => ({
      period: period,
      income: parseFloat(incomeVsExpense[period]?.income || 0),
      expense: parseFloat(incomeVsExpense[period]?.expense || 0),
    }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF19A8",
  ]; // For pie/bar chart consistency

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Reports & Analytics
      </h1>
      {error && <ErrorMessage message={error} />}

      <Card className="flex flex-wrap items-end gap-4 mb-6">
        <Input
          label="Start Date"
          id="reportStartDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
        <Input
          label="End Date"
          id="reportEndDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Spending by Category Report (Pie Chart) */}
          <Card title="Spending by Category">
            {spendingChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={spendingChartData}
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
                    {spendingChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">
                No spending data for the selected period to display a chart.
              </p>
            )}
          </Card>

          {/* Income vs. Expense Trend Report (Bar Chart) */}
          <Card title="Income vs. Expense Trends (Monthly)">
            {incomeExpenseChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={incomeExpenseChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#82ca9d" name="Income" />
                  <Bar dataKey="expense" fill="#ff7300" name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">
                No income or expense data for the selected period to display a
                chart.
              </p>
            )}
          </Card>

          {/* Spending Trends (Line Chart) */}
          <Card title="Spending Trends Over Time">
            {incomeExpenseChartData.length > 0 ? ( // Reusing data as it has period, income, expense
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={incomeExpenseChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ff7300"
                    activeDot={{ r: 8 }}
                    name="Expense"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No data to show spending trends.</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportView;
