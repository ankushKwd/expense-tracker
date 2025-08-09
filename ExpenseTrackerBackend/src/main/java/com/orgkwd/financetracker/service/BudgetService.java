package com.orgkwd.financetracker.service;

import com.orgkwd.financetracker.entity.Budget;
import com.orgkwd.financetracker.entity.Category;
import com.orgkwd.financetracker.entity.Transaction;
import com.orgkwd.financetracker.entity.TransactionType;
import com.orgkwd.financetracker.entity.User;
import com.orgkwd.financetracker.repository.BudgetRepository;
import com.orgkwd.financetracker.repository.CategoryRepository;
import com.orgkwd.financetracker.repository.TransactionRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserService userService;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository; // To calculate actual spending

    public BudgetService(BudgetRepository budgetRepository, UserService userService, CategoryRepository categoryRepository, TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.userService = userService;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<Budget> getAllBudgetsForUser(int month, int year) {
        User currentUser = userService.getCurrentUser();
        return budgetRepository.findByUser(currentUser).stream()
                .filter(b -> b.getMonth() == month && b.getYear() == year)
                .collect(Collectors.toList());
    }

    public Budget createBudget(Budget budget, Long categoryId) {
        User currentUser = userService.getCurrentUser();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

        if (category.getUser() != null && !category.getUser().equals(currentUser)) {
            throw new RuntimeException("Access denied: You don't own this category.");
        }

        if (budgetRepository.findByUserAndCategoryIdAndMonthAndYear(currentUser, categoryId, budget.getMonth(), budget.getYear()).isPresent()) {
            throw new RuntimeException("Budget already exists for this category and month/year.");
        }

        budget.setUser(currentUser);
        budget.setCategory(category);
        return budgetRepository.save(budget);
    }

    public Budget updateBudget(Long id, Budget budgetDetails, Long categoryId) {
        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));

        User currentUser = userService.getCurrentUser();
        if (!existingBudget.getUser().equals(currentUser)) {
            throw new RuntimeException("Access denied: You don't own this budget.");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        if (category.getUser() != null && !category.getUser().equals(currentUser)) {
            throw new RuntimeException("Access denied: You don't own this category.");
        }

        existingBudget.setAmount(budgetDetails.getAmount());
        existingBudget.setCategory(category); // Potentially update category
        existingBudget.setMonth(budgetDetails.getMonth());
        existingBudget.setYear(budgetDetails.getYear());

        // Check for uniqueness if category, month, or year changes
        if (budgetRepository.findByUserAndCategoryIdAndMonthAndYear(currentUser, category.getId(), budgetDetails.getMonth(), budgetDetails.getYear()).isPresent() &&
                !existingBudget.getId().equals(budgetRepository.findByUserAndCategoryIdAndMonthAndYear(currentUser, category.getId(), budgetDetails.getMonth(), budgetDetails.getYear()).get().getId())) {
            throw new RuntimeException("Another budget already exists for this category and month/year.");
        }

        return budgetRepository.save(existingBudget);
    }

    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));

        User currentUser = userService.getCurrentUser();
        if (!budget.getUser().equals(currentUser)) {
            throw new RuntimeException("Access denied: You don't own this budget.");
        }
        budgetRepository.delete(budget);
    }

    // Helper to get current spending for a budget category
    public BigDecimal getCurrentSpendingForBudget(User user, Category category, int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = LocalDate.of(year, month, startDate.lengthOfMonth());

        return transactionRepository.findByUserAndDateBetween(user, startDate, endDate).stream()
                .filter(t -> t.getCategory() != null && t.getCategory().equals(category))
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}