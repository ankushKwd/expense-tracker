package com.orgkwd.financetracker.repository;

import com.orgkwd.financetracker.entity.Category;
import com.orgkwd.financetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserOrUserIsNull(User user); // Find user-specific or global categories
    boolean existsByNameAndUser(String name, User user); // For user-specific unique names
    boolean existsByNameAndUserIsNull(String name); // For global unique names
}