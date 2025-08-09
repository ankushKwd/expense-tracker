import { useContext, useEffect, useState } from "react";
import Button from "../ReusableComponents/Button";
import Card from "../ReusableComponents/Card";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import Input from "../ReusableComponents/Input";
import LoadingSpinner from "../ReusableComponents/LoadingSpinner";
import Select from "../ReusableComponents/Select";
import { API_BASE_URL, apiCall } from "../services/API";
import { AuthContext } from "../Context/AuthContext";

const BudgetForm = ({ navigateTo, budgetId }) => {
  const { getAuthHeaders } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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

    // In a real app, you would fetch a single budget for editing,
    // but the backend API design provided doesn't have a single GET /budgets/{id} endpoint
    // It's GET /budgets?month=X&year=Y. So, for simplicity, this form will always be for adding new.
    // To implement edit, you'd need a specific GET /budgets/{id} on the backend.
    if (budgetId) {
      setIsEditing(true);
      setError(
        "Editing existing budgets is not fully supported by the current backend API design (no GET /budgets/{id}). This form will behave as 'Add New Budget'."
      );
    }
  }, [budgetId, getAuthHeaders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const budgetData = {
      amount: parseFloat(amount),
      month: parseInt(month),
      year: parseInt(year),
    };

    try {
      // Assuming for now it's always POST, as PUT requires GET /budgets/{id} for pre-filling
      await apiCall(
        `${API_BASE_URL}/budgets?categoryId=${categoryId}`,
        "POST",
        budgetData,
        getAuthHeaders()
      );
      navigateTo("budgets"); // Go back to budget list
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
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? "Edit Budget" : "Set New Budget"}
      </h1>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && (
        <Card>
          <form onSubmit={handleSubmit}>
            <Select
              label="Category"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories}
              required
            />
            <Input
              label="Budget Amount"
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500.00"
              step="0.01"
              required
            />
            <Select
              label="Month"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              options={monthOptions}
              required
            />
            <Select
              label="Year"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={yearOptions}
              required
            />
            <div className="flex justify-between mt-6">
              <Button type="submit" disabled={loading}>
                {isEditing ? "Update Budget" : "Set Budget"}
              </Button>
              <Button
                onClick={() => navigateTo("budgets")}
                className="bg-gray-500 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default BudgetForm;
