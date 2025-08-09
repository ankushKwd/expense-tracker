import { useContext, useEffect, useState, useCallback } from "react";
import Button from "../ReusableComponents/Button";
import Card from "../ReusableComponents/Card";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import Input from "../ReusableComponents/Input";
import LoadingSpinner from "../ReusableComponents/LoadingSpinner";
import Select from "../ReusableComponents/Select";
import { API_BASE_URL, apiCall } from "../services/API";
import { AuthContext } from "../Context/AuthContext";

const TransactionList = ({ navigateTo }) => {
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

  const fetchTransactions = useCallback(async () => {
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
  }, [filters, getAuthHeaders]);

  const fetchCategories = useCallback(async () => {
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
      // Not critical to stop page load, but inform user
      setError((prev) => prev + " Failed to load categories for filter.");
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [getAuthHeaders, filters, fetchTransactions, fetchCategories]); // Re-fetch when filters change

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await apiCall(
          `${API_BASE_URL}/transactions/${id}`,
          "DELETE",
          null,
          getAuthHeaders()
        );
        fetchTransactions(); // Refresh list
      } catch (err) {
        setError(err.message || "Failed to delete transaction.");
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.id]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>
      {error && <ErrorMessage message={error} />}

      {/* Filter and Add Bar */}
      <Card className="flex flex-wrap items-end gap-4 mb-6">
        <Input
          label="Start Date"
          id="startDate"
          type="date"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="flex-1 min-w-[150px]"
        />
        <Input
          label="End Date"
          id="endDate"
          type="date"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="flex-1 min-w-[150px]"
        />
        <Select
          label="Category"
          id="categoryId"
          value={filters.categoryId}
          onChange={handleFilterChange}
          options={categories}
          className="flex-1 min-w-[150px]"
        />
        <Select
          label="Type"
          id="type"
          value={filters.type}
          onChange={handleFilterChange}
          options={[
            { value: "INCOME", label: "Income" },
            { value: "EXPENSE", label: "Expense" },
          ]}
          className="flex-1 min-w-[100px]"
        />
        <Button
          onClick={() => navigateTo("add-transaction")}
          className="flex-grow min-w-[120px]"
        >
          Add Transaction
        </Button>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {txn.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {txn.category ? txn.category.name : "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        txn.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {txn.type}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        txn.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ${txn.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        onClick={() =>
                          navigateTo("edit-transaction", { id: txn.id })
                        }
                        className="bg-yellow-500 hover:bg-yellow-700 text-xs px-2 py-1 mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(txn.id)}
                        className="bg-red-500 hover:bg-red-700 text-xs px-2 py-1"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TransactionList;
