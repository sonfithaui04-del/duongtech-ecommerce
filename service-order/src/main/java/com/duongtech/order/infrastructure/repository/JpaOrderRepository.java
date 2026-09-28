package com.duongtech.order.infrastructure.repository;

import com.duongtech.order.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JpaOrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByStatus(com.duongtech.order.domain.model.OrderStatus status);
    List<Order> findByShipperIdOrderByCreatedAtDesc(Long shipperId);

    /**
     * Tổng số lượng đã bán của từng sản phẩm, dùng cho tính năng sắp xếp "Mua nhiều nhất".
     * Chỉ đếm những đơn đã được xác nhận trở đi: đơn còn chờ duyệt hoặc đã huỷ không tính là đã bán.
     * Mỗi phần tử trả về gồm [productId, tổng số lượng].
     */
    @Query("SELECT i.productId, SUM(i.quantity) "
         + "FROM Order o JOIN o.items i "
         + "WHERE o.status NOT IN (com.duongtech.order.domain.model.OrderStatus.PENDING, "
         + "                       com.duongtech.order.domain.model.OrderStatus.CANCELLED) "
         + "GROUP BY i.productId "
         + "ORDER BY SUM(i.quantity) DESC")
    List<Object[]> sumSoldQuantityByProduct();
}
