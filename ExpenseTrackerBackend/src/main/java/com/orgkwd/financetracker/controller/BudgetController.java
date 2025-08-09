package com.orgkwd.financetracker.controller;

import com.orgkwd.financetracker.entity.Budget;
import com.orgkwd.financetracker.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets(
            @RequestParam int month,
            @RequestParam int year) {
        List<Budget> budgets = budgetService.getAllBudgetsForUser(month, year);
        return ResponseEntity.ok(budgets);
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget,
                                              @RequestParam Long categoryId) {
        Budget newBudget = budgetService.createBudget(budget, categoryId);
        return ResponseEntity.status(HttpStatus.CREATED).body(newBudget);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id,
                                              @RequestBody Budget budget,
                                              @RequestParam Long categoryId) {
        Budget updatedBudget = budgetService.updateBudget(id, budget, categoryId);
        return ResponseEntity.ok(updatedBudget);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok(Map.of("deleted", Boolean.TRUE));
    }
}