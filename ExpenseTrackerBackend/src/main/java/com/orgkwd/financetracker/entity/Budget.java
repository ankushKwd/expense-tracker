package com.orgkwd.financetracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "budgets", uniqueConstraints = { // Correct placement here
	    @UniqueConstraint(columnNames = {"user_id", "category_id", "month", "year"})
	})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount; // Budgeted amount

    @Column(nullable = false)
    private int month; // 1-12

    @Column(nullable = false)
    private int year;
    
 // Manually added getters and setters to ensure compatibility
    // if Lombok processing is an issue in your environment.

    public Long getId() { // <--- ADDED THIS METHOD
        return id;
    }

    public void setId(Long id) { // <--- ADDED THIS METHOD
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() { // <--- ADDED/ENSURED THIS METHOD
        return category;
    }

    public void setCategory(Category category) { // <--- ADDED/ENSURED THIS METHOD
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public int getMonth() { // <--- ADDED THIS METHOD
        return month;
    }

    public void setMonth(int month) { // <--- ADDED THIS METHOD
        this.month = month;
    }

    public int getYear() { // <--- ADDED THIS METHOD
        return year;
    }

    public void setYear(int year) { // <--- ADDED THIS METHOD
        this.year = year;
    }
}