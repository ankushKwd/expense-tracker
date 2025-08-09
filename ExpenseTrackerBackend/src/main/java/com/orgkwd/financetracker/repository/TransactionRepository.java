package com.orgkwd.financetracker.repository;

import com.orgkwd.financetracker.entity.Transaction;
import com.orgkwd.financetracker.entity.User;
import com.orgkwd.financetracker.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
    List<Transaction> findByUserAndType(User user, TransactionType type);
    List<Transaction> findByUserAndCategoryId(User user, Long categoryId);
    List<Transaction> findTop10ByUserOrderByDateDesc(User user); // For dashboard recent transactions
}