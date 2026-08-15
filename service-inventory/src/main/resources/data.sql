-- =====================================================================
-- DuongTech · service-inventory · seed data (auto-loaded by Spring Boot)
-- Kho gồm 2 nhóm:
--   (1) 6 mặt hàng laptop đang bán  -> có product_id, được trừ/hoàn tự động theo đơn hàng
--   (2) 6 linh kiện, phụ kiện       -> product_id NULL, chỉ theo dõi vật tư trong kho
-- SQL thuần (không dollar-quoting / PL-pgSQL). Idempotent bằng WHERE NOT EXISTS (...).
-- =====================================================================

-- (1) Tồn kho của các laptop đang bán.
-- product_id trỏ tới sản phẩm bên service-product: khi đơn hàng được xác nhận,
-- service-order gọi /inventory/deduct để trừ kho; khi hủy đơn thì gọi /inventory/restore.
INSERT INTO inventory_items (name, product_id, unit, quantity, min_quantity, cost_per_unit, expiry_date, description, active, created_at, updated_at)
SELECT * FROM (VALUES
  ('Acer Nitro 5',        1, 'chiếc', 12, 3, 19500000, NULL::date, 'Tồn kho laptop gaming Acer Nitro 5.',       true, NOW(), NOW()),
  ('MSI Katana 15',       2, 'chiếc', 10, 3, 21000000, NULL,       'Tồn kho laptop gaming MSI Katana 15.',      true, NOW(), NOW()),
  ('Asus ROG Strix G16',  3, 'chiếc',  6, 2, 28500000, NULL,       'Tồn kho laptop gaming Asus ROG Strix G16.', true, NOW(), NOW()),
  ('Lenovo ThinkPad E14', 4, 'chiếc', 15, 4, 15000000, NULL,       'Tồn kho laptop văn phòng ThinkPad E14.',    true, NOW(), NOW()),
  ('HP Pavilion 14',      5, 'chiếc', 18, 5, 12300000, NULL,       'Tồn kho laptop văn phòng HP Pavilion 14.',  true, NOW(), NOW()),
  ('Dell Inspiron 15',    6, 'chiếc', 16, 4, 13200000, NULL,       'Tồn kho laptop văn phòng Dell Inspiron 15.',true, NOW(), NOW())
) AS t(name, product_id, unit, quantity, min_quantity, cost_per_unit, expiry_date, description, active, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM inventory_items WHERE product_id IS NOT NULL);

-- (2) Linh kiện, phụ kiện phục vụ bảo hành, sửa chữa (không gắn sản phẩm bán ra)
INSERT INTO inventory_items (name, product_id, unit, quantity, min_quantity, cost_per_unit, expiry_date, description, active, created_at, updated_at)
SELECT * FROM (VALUES
  ('RAM DDR5 16GB',            NULL::bigint, 'thanh', 120, 20, 1200000, NULL::date, 'RAM DDR5 16GB 4800MHz cho laptop.',               true, NOW(), NOW()),
  ('SSD NVMe 1TB',             NULL,         'cái',    80, 15, 1800000, NULL,       'Ổ cứng SSD NVMe PCIe Gen4 1TB.',                  true, NOW(), NOW()),
  ('Sạc laptop 65W USB-C',     NULL,         'cái',   200, 30,  350000, NULL,       'Củ sạc nhanh 65W chuẩn USB-C.',                   true, NOW(), NOW()),
  ('Pin laptop thay thế',      NULL,         'cái',    45, 10,  900000, NULL,       'Pin laptop dung lượng cao, tương thích đa dòng.', true, NOW(), NOW()),
  ('Bàn phím laptop thay thế', NULL,         'cái',    60, 10,  450000, NULL,       'Bàn phím thay thế cho laptop phổ thông.',         true, NOW(), NOW()),
  ('Màn hình laptop 15.6" FHD',NULL,         'cái',    25,  5, 1500000, NULL,       'Panel màn hình 15.6 inch Full HD.',               true, NOW(), NOW())
) AS t(name, product_id, unit, quantity, min_quantity, cost_per_unit, expiry_date, description, active, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM inventory_items WHERE product_id IS NULL);

-- Đồng bộ sequence IDENTITY để insert sau này không đụng id
SELECT setval(pg_get_serial_sequence('inventory_items', 'id'), COALESCE((SELECT MAX(id) FROM inventory_items), 1), true);
