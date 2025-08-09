package com.orgkwd.financetracker.service;

import com.orgkwd.financetracker.entity.Category;
import com.orgkwd.financetracker.entity.Transaction;
import com.orgkwd.financetracker.entity.User;
import com.orgkwd.financetracker.repository.CategoryRepository;
import com.orgkwd.financetracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserService userService;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, UserService userService, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.userService = userService;
        this.categoryRepository = categoryRepository;
    }

    public List<Transaction> getAllTransactionsForUser(LocalDate startDate, LocalDate endDate, Long categoryId, String type) {
        User currentUser = userService.getCurrentUser();
        // Implement filtering logic based on parameters
        if (startDate != null && endDate != null) {
            return transactionRepository.findByUserAndDateBetween(currentUser, startDate, endDate);
        }
        // Add more filter combinations as needed
        return transactionRepository.findByUser(currentUser);
    }

    public Transaction getTransactionByIdForUser(Long id) {
        User currentUser = userService.getCurrentUser();
        return transactionRepository.findById(id)
                .filter(t -> t.getUser().equals(currentUser))
                .orElseThrow(() -> new RuntimeException("Transaction not found or access denied: " + id));
    }

    public Transaction createTransaction(Transaction transaction, Long categoryId) {
        User currentUser = userService.getCurrentUser();
        transaction.setUser(currentUser); // Assign to current user

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            if (category.getUser() != null && !category.getUser().equals(currentUser)) {
                throw new RuntimeException("Access denied: You don't own this category.");
            }
            transaction.setCategory(category);
        }

        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction transactionDetails, Long categoryId) {
        Transaction transaction = getTransactionByIdForUser(id); // Ensures user owns the transaction

        transaction.setAmount(transactionDetails.getAmount());
        transaction.setDescription(transactionDetails.getDescription());
        transaction.setDate(transactionDetails.getDate());
        transaction.setType(transactionDetails.getType());

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            if (category.getUser() != null && !category.getUser().equals(transaction.getUser())) {
                throw new RuntimeException("Access denied: You don't own this category.");
            }
            transaction.setCategory(category);
        } else {
            transaction.setCategory(null);
        }

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        Transaction transaction = getTransactionByIdForUser(id); // Ensures user owns the transaction
        transactionRepository.delete(transaction);
    }
}