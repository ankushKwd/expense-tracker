package com.orgkwd.financetracker.repository;

import com.orgkwd.financetracker.entity.Budget;
import com.orgkwd.financetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
    Optional<Budget> findByUserAndCategoryIdAndMonthAndYear(User user, Long categoryId, int month, int year);
}