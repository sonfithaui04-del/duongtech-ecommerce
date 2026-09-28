package com.duongtech.order.infrastructure.repository;

import com.duongtech.order.domain.model.Order;
import com.duongtech.order.domain.model.OrderStatus;
import com.duongtech.order.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OrderRepositoryImpl implements OrderRepository {
    private final JpaOrderRepository jpaRepository;

    @Override
    public Optional<Order> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Order> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return jpaRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Order> findByStatus(OrderStatus status) {
        return jpaRepository.findByStatus(status);
    }

    @Override
    public List<Order> findByShipperId(Long shipperId) {
        return jpaRepository.findByShipperIdOrderByCreatedAtDesc(shipperId);
    }

    @Override
    public Order save(Order order) {
        return jpaRepository.save(order);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public java.util.Map<Long, Long> countSoldQuantityByProduct() {
        java.util.Map<Long, Long> ketQua = new java.util.LinkedHashMap<>();
        for (Object[] dong : jpaRepository.sumSoldQuantityByProduct()) {
            if (dong == null || dong.length < 2 || dong[0] == null) continue;
            ketQua.put(((Number) dong[0]).longValue(), ((Number) dong[1]).longValue());
        }
        return ketQua;
    }
}
