package com.orgkwd.financetracker.service;

import com.orgkwd.financetracker.entity.Category;
import com.orgkwd.financetracker.entity.User;
import com.orgkwd.financetracker.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public CategoryService(CategoryRepository categoryRepository, UserService userService) {
        this.categoryRepository = categoryRepository;
        this.userService = userService;
    }

    public List<Category> getAllCategoriesForUser() {
        User currentUser = userService.getCurrentUser();
        return categoryRepository.findByUserOrUserIsNull(currentUser);
    }

    public Category createCategory(Category category) {
        User currentUser = userService.getCurrentUser();
        if (categoryRepository.existsByNameAndUser(category.getName(), currentUser)) {
            throw new RuntimeException("Category with this name already exists for this user.");
        }
        category.setUser(currentUser); // Assign to current user
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        User currentUser = userService.getCurrentUser();
        if (!category.getUser().equals(currentUser)) {
            throw new RuntimeException("Access denied: You don't own this category.");
        }

        if (categoryRepository.existsByNameAndUser(categoryDetails.getName(), currentUser) &&
            !category.getName().equals(categoryDetails.getName())) { // Check if new name is taken by current user
            throw new RuntimeException("Another category with this name already exists for you.");
        }

        category.setName(categoryDetails.getName());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        User currentUser = userService.getCurrentUser();
        if (!category.getUser().equals(currentUser)) {
            throw new RuntimeException("Access denied: You don't own this category.");
        }
        categoryRepository.delete(category);
    }
}