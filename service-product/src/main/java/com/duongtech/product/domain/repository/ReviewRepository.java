package com.duongtech.product.domain.repository;

import com.duongtech.product.domain.model.Review;
import java.util.List;
import java.util.Optional;

/**
 * Review Repository Interface (Domain Layer)
 */
public interface ReviewRepository {
    Optional<Review> findById(Long id);
    List<Review> findByProductId(Long productId);
    List<Review> findByUserId(Long userId);
    Review save(Review review);
    void deleteById(Long id);
}
