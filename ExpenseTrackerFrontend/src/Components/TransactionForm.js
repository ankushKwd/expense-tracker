import { useContext, useEffect, useState } from "react";
import Button from "../ReusableComponents/Button";
import Card from "../ReusableComponents/Card";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import Input from "../ReusableComponents/Input";
import LoadingSpinner from "../ReusableComponents/LoadingSpinner";
import Select from "../ReusableComponents/Select";
import { API_BASE_URL, apiCall } from "../services/API";
import { AuthContext } from "../Context/AuthContext";

const TransactionForm = ({ navigateTo, transactionId }) => {
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
          setAmount(data.amount);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      navigateTo("transactions"); // Go back to transaction list
    } catch (err) {
      setError(err.message || "Failed to save transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? "Edit Transaction" : "Add New Transaction"}
      </h1>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && (
        <Card>
          <form onSubmit={handleSubmit}>
            <Input
              label="Description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Groceries, Salary"
              required
            />
            <Input
              label="Amount"
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 50.00"
              step="0.01"
              required
            />
            <Input
              label="Date"
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Select
              label="Type"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: "EXPENSE", label: "Expense" },
                { value: "INCOME", label: "Income" },
              ]}
              required
            />
            <Select
              label="Category"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories}
            />
            <div className="flex justify-between mt-6">
              <Button type="submit" disabled={loading}>
                {isEditing ? "Update Transaction" : "Add Transaction"}
              </Button>
              <Button
                onClick={() => navigateTo("transactions")}
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

export default TransactionForm;
