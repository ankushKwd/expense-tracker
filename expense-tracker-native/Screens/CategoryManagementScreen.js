import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { NativeCard } from "../ReusableUIComponents/NativeCard";
import { NativeErrorMessage } from "../ReusableUIComponents/NativeErrorMessage";
import { NativeInput } from "../ReusableUIComponents/NativeInput";
import { NativeButton } from "../ReusableUIComponents/NativeButton";
import { AuthContext } from "../context/AuthContext";
import { apiCall } from "../services/API";
import { API_BASE_URL } from "../config"; // Ensure this points to your API base URL

export const CategoryManagementScreen = () => {
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
    fetchCategories();
  }, [getAuthHeaders]);

  const handleAddCategory = async () => {
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

  const handleUpdateCategory = async () => {
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
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? All associated transactions/budgets might become uncategorized.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
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
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Category Management</Text>
      {error && <NativeErrorMessage message={error} />}

      <NativeCard title="Add New Category">
        <NativeInput
          label="Category Name"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="e.g., Utilities, Dining"
        />
        <NativeButton
          onPress={handleAddCategory}
          disabled={loading}
          style={styles.addButton}
        >
          {loading ? "Adding..." : "Add Category"}
        </NativeButton>
      </NativeCard>

      <NativeCard title="Existing Categories">
        {loading ? (
          <NativeLoadingSpinner />
        ) : categories.length === 0 ? (
          <Text style={styles.noDataText}>No categories found. Add some!</Text>
        ) : (
          <View>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryListItem}>
                {editingCategoryId === category.id ? (
                  <NativeInput
                    value={editingCategoryName}
                    onChangeText={setEditingCategoryName}
                    style={styles.editingCategoryInput}
                  />
                ) : (
                  <Text style={styles.categoryNameText}>{category.name}</Text>
                )}
                <View style={styles.buttonGroup}>
                  {editingCategoryId === category.id ? (
                    <NativeButton
                      onPress={handleUpdateCategory}
                      style={styles.saveButton}
                      textStyle={styles.actionButtonText}
                    >
                      Save
                    </NativeButton>
                  ) : (
                    <NativeButton
                      onPress={() => handleEditClick(category)}
                      style={styles.editButton}
                      textStyle={styles.actionButtonText}
                    >
                      Edit
                    </NativeButton>
                  )}
                  <NativeButton
                    onPress={() => handleDeleteCategory(category.id)}
                    style={styles.deleteButton}
                    textStyle={styles.actionButtonText}
                  >
                    Delete
                  </NativeButton>
                </View>
              </View>
            ))}
          </View>
        )}
      </NativeCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  categoryNameText: {
    fontSize: 16,
    color: "#1f2937",
    flex: 1,
  },
  editingCategoryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
