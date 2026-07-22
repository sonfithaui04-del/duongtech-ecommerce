package com.duongtech.menu.domain.repository;

import com.duongtech.menu.domain.model.MenuItem;
import java.util.List;
import java.util.Optional;

/**
 * MenuItem Repository Interface (Domain Layer)
 */
public interface MenuItemRepository {
    Optional<MenuItem> findById(Long id);
    List<MenuItem> findAll();
    List<MenuItem> findAllAvailable();
    List<MenuItem> findByCategoryId(Long categoryId);
    MenuItem save(MenuItem menuItem);
    void deleteById(Long id);
}
