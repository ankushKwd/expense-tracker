package com.orgkwd.financetracker.service;

import com.orgkwd.financetracker.entity.Transaction;
import com.orgkwd.financetracker.entity.TransactionType;
import com.orgkwd.financetracker.entity.User;
import com.orgkwd.financetracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public ReportService(TransactionRepository transactionRepository, UserService userService) {
        this.transactionRepository = transactionRepository;
        this.userService = userService;
    }

    public Map<String, BigDecimal> getFinancialSummary(LocalDate startDate, LocalDate endDate) {
        User currentUser = userService.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetween(currentUser, startDate, endDate);

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("netBalance", totalIncome.subtract(totalExpenses));
        return summary;
    }

    public Map<String, BigDecimal> getSpendingByCategory(LocalDate startDate, LocalDate endDate) {
        User currentUser = userService.getCurrentUser();
        List<Transaction> expenses = transactionRepository.findByUserAndDateBetween(currentUser, startDate, endDate).stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .collect(Collectors.toList());

        return expenses.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCategory() != null ? t.getCategory().getName() : "Uncategorized",
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));
    }

    public Map<String, Map<String, BigDecimal>> getIncomeVsExpenseTrends(LocalDate startDate, LocalDate endDate, String periodType) {
        User currentUser = userService.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetween(currentUser, startDate, endDate);

        Map<String, Map<String, BigDecimal>> trends = new HashMap<>();

        transactions.forEach(transaction -> {
            String periodKey;
            if ("monthly".equalsIgnoreCase(periodType)) {
                periodKey = YearMonth.from(transaction.getDate()).toString();
            } else if ("yearly".equalsIgnoreCase(periodType)) {
                periodKey = String.valueOf(transaction.getDate().getYear());
            } else { // Daily or other
                periodKey = transaction.getDate().toString();
            }

            trends.computeIfAbsent(periodKey, k -> new HashMap<>());
            Map<String, BigDecimal> periodData = trends.get(periodKey);

            if (transaction.getType() == TransactionType.INCOME) {
                periodData.merge("income", transaction.getAmount(), BigDecimal::add);
            } else {
                periodData.merge("expense", transaction.getAmount(), BigDecimal::add);
            }
        });
        return trends;
    }
}