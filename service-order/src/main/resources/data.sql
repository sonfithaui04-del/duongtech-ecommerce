-- =====================================================================
-- DuongTech · service-order · seed data (auto-loaded by Spring Boot)
-- 17 đơn hàng + 24 dòng order_items (id tường minh + setval).
-- product_id/name tham chiếu 12 sản phẩm gốc của service-product.
-- SQL thuần (không dollar-quoting / PL-pgSQL). Idempotent bằng WHERE NOT EXISTS (...).
-- =====================================================================

-- 17 đơn hàng (chỉ chèn khi bảng orders đang rỗng)
INSERT INTO orders (id, user_id, email, total_amount, status, delivery_address, phone_number, customer_name, notes, payment_method, points_used, payment_status, shipper_id, assigned_at, created_at, updated_at)
SELECT * FROM (VALUES
  (1,  2, 'khach1@gmail.com', 32500000, 'COMPLETED',  '12 Lê Lợi, Q.1, TP.HCM',         '0901000001', 'Nguyễn Văn A',  'Giao giờ hành chính',        'COD',   0, 'SUCCESS', NULL::bigint, NULL::timestamp, NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days'),
  (2,  3, 'khach2@gmail.com', 27000000, 'COMPLETED',  '45 Nguyễn Huệ, Q.1, TP.HCM',     '0901000002', 'Trần Thị B',    NULL,                          'SEPAY', 0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '18 days', NOW() - INTERVAL '17 days'),
  (3,  2, 'khach1@gmail.com', 44500000, 'DELIVERING', '12 Lê Lợi, Q.1, TP.HCM',         '0901000001', 'Nguyễn Văn A',  'Gọi trước khi giao',         'SEPAY', 0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '3 days',  NOW() - INTERVAL '1 days'),
  (4,  4, 'khach3@gmail.com', 28000000, 'PENDING',    '88 Trần Hưng Đạo, Q.5, TP.HCM',  '0901000003', 'Lê Văn C',      NULL,                          'COD',   0, 'PENDING', NULL, NULL, NOW() - INTERVAL '1 days',  NOW() - INTERVAL '1 days'),
  (5,  3, 'khach2@gmail.com', 48000000, 'CONFIRMED',  '45 Nguyễn Huệ, Q.1, TP.HCM',     '0901000002', 'Trần Thị B',    'Xuất hoá đơn công ty',       'SEPAY', 0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days'),
  (6,  2, 'khach1@gmail.com', 22500000, 'PREPARING',  '12 Lê Lợi, Q.1, TP.HCM',         '0901000001', 'Nguyễn Văn A',  NULL,                          'COD',   0, 'PENDING', NULL, NULL, NOW() - INTERVAL '2 days',  NOW() - INTERVAL '1 days'),
  (7,  5, 'khach4@gmail.com', 29000000, 'COMPLETED',  '10 Hai Bà Trưng, Hà Nội',        '0901000004', 'Phạm Thị D',    NULL,                          'SEPAY', 0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '25 days', NOW() - INTERVAL '23 days'),
  (8,  4, 'khach3@gmail.com', 24000000, 'CANCELLED',  '88 Trần Hưng Đạo, Q.5, TP.HCM',  '0901000003', 'Lê Văn C',      'Khách đổi ý',                'COD',   0, 'FAILED',  NULL, NULL, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
  (9,  3, 'khach2@gmail.com',  7500000, 'COMPLETED',  '45 Nguyễn Huệ, Q.1, TP.HCM',     '0901000002', 'Trần Thị B',    NULL,                          'COD',   0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days'),
  (10, 2, 'khach1@gmail.com', 17000000, 'READY',      '12 Lê Lợi, Q.1, TP.HCM',         '0901000001', 'Nguyễn Văn A',  NULL,                          'SEPAY', 0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '1 days',  NOW() - INTERVAL '1 days'),
  (11, 6, 'khach5@gmail.com', 16000000, 'DELIVERING', '5 Lý Thường Kiệt, Đà Nẵng',      '0901000005', 'Võ Văn E',      'Giao buổi chiều',            'COD',   0, 'PENDING', NULL, NULL, NOW() - INTERVAL '4 days',  NOW() - INTERVAL '2 days'),
  (12, 4, 'khach3@gmail.com', 32000000, 'COMPLETED',  '88 Trần Hưng Đạo, Q.5, TP.HCM',  '0901000003', 'Lê Văn C',      NULL,                          'SEPAY', 0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '28 days'),
  (13, 3, 'khach2@gmail.com', 29500000, 'PENDING',    '45 Nguyễn Huệ, Q.1, TP.HCM',     '0901000002', 'Trần Thị B',    NULL,                          'COD',   0, 'PENDING', NULL, NULL, NOW() - INTERVAL '1 days',  NOW() - INTERVAL '1 days'),
  (14, 5, 'khach4@gmail.com', 44000000, 'COMPLETED',  '10 Hai Bà Trưng, Hà Nội',        '0901000004', 'Phạm Thị D',    'Đóng gói kỹ',                'SEPAY', 0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '8 days',  NOW() - INTERVAL '6 days'),
  (15, 2, 'khach1@gmail.com', 42000000, 'CONFIRMED',  '12 Lê Lợi, Q.1, TP.HCM',         '0901000001', 'Nguyễn Văn A',  NULL,                          'SEPAY', 0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days'),
  (16, 6, 'khach5@gmail.com', 14500000, 'COMPLETED',  '5 Lý Thường Kiệt, Đà Nẵng',      '0901000005', 'Võ Văn E',      NULL,                          'COD',   0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),
  (17, 4, 'khach3@gmail.com', 50500000, 'PREPARING',  '88 Trần Hưng Đạo, Q.5, TP.HCM',  '0901000003', 'Lê Văn C',      'Cần giao gấp',               'SEPAY', 0, 'SUCCESS', NULL, NULL, NOW() - INTERVAL '1 days',  NOW() - INTERVAL '1 days')
) AS t(id, user_id, email, total_amount, status, delivery_address, phone_number, customer_name, notes, payment_method, points_used, payment_status, shipper_id, assigned_at, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM orders);

-- 24 dòng order_items (guard theo bảng order_items để idempotent độc lập)
INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price, subtotal)
SELECT * FROM (VALUES
  (1,  1,  1,  'Asus ROG Strix G16',         1, 32000000, 32000000),
  (2,  1,  12, 'Balo laptop chống sốc',      1,   500000,   500000),
  (3,  2,  9,  'MacBook Air 13 M2',          1, 27000000, 27000000),
  (4,  3,  8,  'Dell XPS 15',                1, 42000000, 42000000),
  (5,  3,  11, 'Chuột Logitech MX Master 3S',1,  2500000,  2500000),
  (6,  4,  5,  'HP Pavilion 14',             2, 14000000, 28000000),
  (7,  5,  7,  'MacBook Pro 14 M3 Pro',      1, 48000000, 48000000),
  (8,  6,  3,  'Acer Nitro 5',               1, 22000000, 22000000),
  (9,  6,  12, 'Balo laptop chống sốc',      1,   500000,   500000),
  (10, 7,  10, 'LG Gram 14',                 1, 29000000, 29000000),
  (11, 8,  2,  'MSI Katana 15',              1, 24000000, 24000000),
  (12, 9,  11, 'Chuột Logitech MX Master 3S',3,  2500000,  7500000),
  (13, 10, 6,  'Lenovo ThinkPad E14',        1, 17000000, 17000000),
  (14, 11, 4,  'Dell Inspiron 15',           1, 15000000, 15000000),
  (15, 11, 12, 'Balo laptop chống sốc',      2,   500000,  1000000),
  (16, 12, 1,  'Asus ROG Strix G16',         1, 32000000, 32000000),
  (17, 13, 9,  'MacBook Air 13 M2',          1, 27000000, 27000000),
  (18, 13, 11, 'Chuột Logitech MX Master 3S',1,  2500000,  2500000),
  (19, 14, 3,  'Acer Nitro 5',               2, 22000000, 44000000),
  (20, 15, 8,  'Dell XPS 15',                1, 42000000, 42000000),
  (21, 16, 5,  'HP Pavilion 14',             1, 14000000, 14000000),
  (22, 16, 12, 'Balo laptop chống sốc',      1,   500000,   500000),
  (23, 17, 7,  'MacBook Pro 14 M3 Pro',      1, 48000000, 48000000),
  (24, 17, 11, 'Chuột Logitech MX Master 3S',1,  2500000,  2500000)
) AS t(id, order_id, product_id, product_name, quantity, price, subtotal)
WHERE NOT EXISTS (SELECT 1 FROM order_items);

-- Đồng bộ sequence IDENTITY để insert sau này không đụng id
SELECT setval(pg_get_serial_sequence('orders', 'id'), COALESCE((SELECT MAX(id) FROM orders), 1), true);
SELECT setval(pg_get_serial_sequence('order_items', 'id'), COALESCE((SELECT MAX(id) FROM order_items), 1), true);
