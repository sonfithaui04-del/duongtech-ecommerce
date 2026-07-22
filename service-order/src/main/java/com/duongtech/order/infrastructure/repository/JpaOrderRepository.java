package com.duongtech.order.infrastructure.repository;

import com.duongtech.order.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JpaOrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByStatus(com.duongtech.order.domain.model.OrderStatus status);
    List<Order> findByShipperIdOrderByCreatedAtDesc(Long shipperId);
}
