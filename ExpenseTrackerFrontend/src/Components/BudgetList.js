import { useContext, useEffect, useState, useCallback } from "react";
import Button from "../ReusableComponents/Button";
import Card from "../ReusableComponents/Card";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import LoadingSpinner from "../ReusableComponents/LoadingSpinner";
import Select from "../ReusableComponents/Select";
import { API_BASE_URL, apiCall } from "../services/API";
import { AuthContext } from "../Context/AuthContext";

const BudgetList = ({ navigateTo }) => {
  const { getAuthHeaders } = useContext(AuthContext);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [spendingByCategory, setSpendingByCategory] = useState({}); // To show actual spending

  const fetchBudgetsAndSpending = useCallback(async () => {
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
  }, [getAuthHeaders, month, year]);

  useEffect(() => {
    fetchBudgetsAndSpending();
  }, [getAuthHeaders, month, year, fetchBudgetsAndSpending]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await apiCall(
          `${API_BASE_URL}/budgets/${id}`,
          "DELETE",
          null,
          getAuthHeaders()
        );
        fetchBudgetsAndSpending(); // Refresh list
      } catch (err) {
        setError(err.message || "Failed to delete budget.");
      }
    }
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Budgets</h1>
      {error && <ErrorMessage message={error} />}

      <Card className="flex flex-wrap items-end gap-4 mb-6">
        <Select
          label="Month"
          id="month"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          options={monthOptions}
          className="flex-1 min-w-[120px]"
        />
        <Select
          label="Year"
          id="year"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          options={yearOptions}
          className="flex-1 min-w-[100px]"
        />
        <Button
          onClick={() => navigateTo("add-budget")}
          className="flex-grow min-w-[150px]"
        >
          Set New Budget
        </Button>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : budgets.length === 0 ? (
        <p className="text-center text-gray-500">
          No budgets set for{" "}
          {monthOptions.find((o) => o.value === month)?.label} {year}.
        </p>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budgeted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {budgets.map((budget) => {
                  const spent = spendingByCategory[budget.category?.name] || 0;
                  const progress = (spent / budget.amount) * 100;
                  const progressBarColor =
                    progress > 100 ? "bg-red-500" : "bg-green-500";
                  const remaining = budget.amount - spent;

                  return (
                    <tr key={budget.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {budget.category ? budget.category.name : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ${budget.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ${spent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${progressBarColor} h-2 rounded-full`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1 block">
                          {progress.toFixed(0)}% (
                          {remaining >= 0
                            ? `$${remaining.toFixed(2)} left`
                            : `$${Math.abs(remaining).toFixed(2)} over`}
                          )
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          onClick={() =>
                            navigateTo("edit-budget", { id: budget.id })
                          }
                          className="bg-yellow-500 hover:bg-yellow-700 text-xs px-2 py-1 mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(budget.id)}
                          className="bg-red-500 hover:bg-red-700 text-xs px-2 py-1"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BudgetList;
