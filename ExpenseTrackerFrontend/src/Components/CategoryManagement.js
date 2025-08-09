import { useContext, useEffect, useState } from "react";
import Button from "../ReusableComponents/Button";
import Card from "../ReusableComponents/Card";
import ErrorMessage from "../ReusableComponents/ErrorMessage";
import Input from "../ReusableComponents/Input";
import LoadingSpinner from "../ReusableComponents/LoadingSpinner";
import { API_BASE_URL, apiCall } from "../services/API";
import { AuthContext } from "../Context/AuthContext";

const CategoryManagement = () => {
  const { getAuthHeaders } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiCall(
        `${API_BASE_URL}/categories`,
        "GET",
        null,
        getAuthHeaders()
      );
      setCategories(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // define fetchCategories inside useEffect to avoid missing dependency warning
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiCall(
          `${API_BASE_URL}/categories`,
          "GET",
          null,
          getAuthHeaders()
        );
        setCategories(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAuthHeaders]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiCall(
        `${API_BASE_URL}/categories`,
        "POST",
        { name: newCategoryName },
        getAuthHeaders()
      );
      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      setError(
        err.message || "Failed to add category. It might already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiCall(
        `${API_BASE_URL}/categories/${editingCategoryId}`,
        "PUT",
        { name: editingCategoryName },
        getAuthHeaders()
      );
      setEditingCategoryId(null);
      setEditingCategoryName("");
      fetchCategories();
    } catch (err) {
      setError(err.message || "Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? All associated transactions/budgets might become uncategorized."
      )
    ) {
      setLoading(true);
      setError("");
      try {
        await apiCall(
          `${API_BASE_URL}/categories/${id}`,
          "DELETE",
          null,
          getAuthHeaders()
        );
        fetchCategories();
      } catch (err) {
        setError(err.message || "Failed to delete category.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Category Management
      </h1>
      {error && <ErrorMessage message={error} />}

      {/* Add New Category Form */}
      <Card title="Add New Category">
        <form
          onSubmit={handleAddCategory}
          className="flex flex-col sm:flex-row gap-4 items-end"
        >
          <Input
            label="Category Name"
            id="newCategoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g., Utilities, Dining"
            className="flex-grow"
            required
          />
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </Card>

      {/* Existing Categories List */}
      <Card title="Existing Categories">
        {loading ? (
          <LoadingSpinner />
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No categories found. Add some!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {editingCategoryId === category.id ? (
                        <Input
                          id="editingCategoryName"
                          value={editingCategoryName}
                          onChange={(e) =>
                            setEditingCategoryName(e.target.value)
                          }
                          className="w-full"
                          autoFocus
                        />
                      ) : (
                        category.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingCategoryId === category.id ? (
                        <Button
                          onClick={handleUpdateCategory}
                          className="bg-green-500 hover:bg-green-700 text-xs px-2 py-1 mr-2"
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleEditClick(category)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-xs px-2 py-1 mr-2"
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteCategory(category.id)}
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
        )}
      </Card>
    </div>
  );
};

export default CategoryManagement;
