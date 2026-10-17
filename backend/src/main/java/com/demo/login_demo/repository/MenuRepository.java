package com.demo.login_demo.repository;

import com.demo.login_demo.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Integer> {
    // Basic CRUD methods are already included
    // Helper to find all enabled menus sorted by order
    List<Menu> findByEnabledTrueOrderBySortOrderAsc();
}