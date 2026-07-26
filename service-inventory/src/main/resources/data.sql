-- =====================================================================
-- DuongTech · service-inventory · seed data (auto-loaded by Spring Boot)
-- 6 mặt hàng tồn kho (linh kiện/phụ kiện laptop).
-- SQL thuần (không dollar-quoting / PL-pgSQL). Idempotent bằng WHERE NOT EXISTS (...).
-- =====================================================================

-- 6 mặt hàng (chỉ chèn khi bảng inventoryItems đang rỗng)
INSERT INTO inventory_items (name, unit, quantity, min_quantity, cost_per_unit, expiry_date, description, active, created_at, updated_at)
SELECT * FROM (VALUES
  ('RAM DDR5 16GB',            'thanh', 120, 20, 1200000, NULL::date, 'RAM DDR5 16GB 4800MHz cho laptop.',               true, NOW(), NOW()),
  ('SSD NVMe 1TB',             'cái',    80, 15, 1800000, NULL,       'Ổ cứng SSD NVMe PCIe Gen4 1TB.',                  true, NOW(), NOW()),
  ('Sạc laptop 65W USB-C',     'cái',   200, 30,  350000, NULL,       'Củ sạc nhanh 65W chuẩn USB-C.',                   true, NOW(), NOW()),
  ('Pin laptop thay thế',      'cái',    45, 10,  900000, NULL,       'Pin laptop dung lượng cao, tương thích đa dòng.', true, NOW(), NOW()),
  ('Bàn phím laptop thay thế', 'cái',    60, 10,  450000, NULL,       'Bàn phím thay thế cho laptop phổ thông.',         true, NOW(), NOW()),
  ('Màn hình laptop 15.6" FHD','cái',    25,  5, 1500000, NULL,       'Panel màn hình 15.6 inch Full HD.',               true, NOW(), NOW())
) AS t(name, unit, quantity, min_quantity, cost_per_unit, expiry_date, description, active, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM inventory_items);

-- Đồng bộ sequence IDENTITY để insert sau này không đụng id
SELECT setval(pg_get_serial_sequence('inventory_items', 'id'), COALESCE((SELECT MAX(id) FROM inventory_items), 1), true);
