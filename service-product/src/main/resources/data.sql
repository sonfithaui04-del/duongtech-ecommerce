-- =====================================================================
-- DuongTech · service-product · seed data (auto-loaded by Spring Boot)
-- 5 danh mục + 12 sản phẩm gốc + 100 sản phẩm sinh thêm = 112 products
-- Ảnh dùng loremflickr (theo từ khoá, ổn định theo lock).
-- SQL thuần (không dollar-quoting / PL-pgSQL) để Spring ScriptUtils chạy được.
-- IDEMPOTENT bằng WHERE NOT EXISTS (...). Bảng do Hibernate tạo trước,
-- nhờ spring.jpa.defer-datasource-initialization=true.
-- =====================================================================

-- 5 danh mục (chỉ chèn khi bảng categories đang rỗng)
INSERT INTO categories (name, description, display_order, active, created_at, updated_at)
SELECT v.name, v.description, v.display_order, true, NOW(), NOW()
FROM (VALUES
  ('Laptop Gaming',    'Laptop chơi game hiệu năng cao, card đồ hoạ rời, màn tần số quét cao.', 1),
  ('Laptop Văn phòng', 'Laptop mỏng nhẹ, pin lâu, phù hợp công việc văn phòng và học tập.',    2),
  ('Laptop Đồ hoạ',    'Workstation cho thiết kế, dựng phim, màn hình chuẩn màu.',              3),
  ('Ultrabook',        'Ultrabook siêu mỏng nhẹ, di động cao, pin cả ngày.',                   4),
  ('Phụ kiện laptop',  'Phụ kiện laptop chính hãng: chuột, bàn phím, balo, tai nghe...',        5)
) AS v(name, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories);

-- 12 sản phẩm gốc (hero) — ảnh loremflickr đúng loại, lock theo display_order
INSERT INTO products (category_id, name, description, price, image_url, available, display_order, average_rating, total_reviews, created_at, updated_at)
SELECT c.id, v.name, v.description, v.price, v.image_url, true, v.display_order, v.average_rating, v.total_reviews, NOW(), NOW()
FROM (VALUES
  ('Laptop Gaming',    'Asus ROG Strix G16',         'Laptop gaming RTX 4060, i7-13650HX, 16GB RAM, màn 165Hz.', 32000000, 'https://loremflickr.com/500/400/gaming,laptop?lock=1',   1,  4.8, 126),
  ('Laptop Gaming',    'MSI Katana 15',              'Gaming RTX 4050, i7, 16GB/1TB, màn 144Hz.',                24000000, 'https://loremflickr.com/500/400/gaming,laptop?lock=2',   2,  4.6, 88),
  ('Laptop Gaming',    'Acer Nitro 5',               'Gaming Ryzen 7, RTX 4050, 16GB, tản nhiệt kép.',           22000000, 'https://loremflickr.com/500/400/gaming,laptop?lock=3',   3,  4.5, 102),
  ('Laptop Văn phòng', 'Dell Inspiron 15',           'Văn phòng i5-1335U, 16GB/512GB, mỏng nhẹ.',                15000000, 'https://loremflickr.com/500/400/laptop?lock=4',          4,  4.4, 65),
  ('Laptop Văn phòng', 'HP Pavilion 14',             'Văn phòng Ryzen 5, 16GB, pin lâu.',                        14000000, 'https://loremflickr.com/500/400/laptop?lock=5',          5,  4.3, 54),
  ('Laptop Văn phòng', 'Lenovo ThinkPad E14',        'Doanh nhân i7-1360P, 16GB, bảo mật vân tay.',              17000000, 'https://loremflickr.com/500/400/laptop?lock=6',          6,  4.7, 73),
  ('Laptop Đồ hoạ',    'MacBook Pro 14 M3 Pro',      'Chip M3 Pro, 18GB, màn Liquid Retina XDR.',                48000000, 'https://loremflickr.com/500/400/macbook?lock=7',         7,  4.9, 141),
  ('Laptop Đồ hoạ',    'Dell XPS 15',                'Workstation OLED 3.5K, i9, RTX 4070, 32GB.',               42000000, 'https://loremflickr.com/500/400/laptop?lock=8',          8,  4.8, 97),
  ('Ultrabook',        'MacBook Air 13 M2',          'Ultrabook M2, 8GB/256GB, siêu mỏng nhẹ.',                  27000000, 'https://loremflickr.com/500/400/macbook,air?lock=9',     9,  4.8, 118),
  ('Ultrabook',        'LG Gram 14',                 'Ultrabook 999g, Evo, pin cả ngày.',                        29000000, 'https://loremflickr.com/500/400/laptop?lock=10',         10, 4.6, 61),
  ('Phụ kiện laptop',  'Chuột Logitech MX Master 3S','Chuột không dây cao cấp, cảm biến 8K DPI.',                 2500000, 'https://loremflickr.com/500/400/computer,mouse?lock=11', 11, 4.9, 210),
  ('Phụ kiện laptop',  'Balo laptop chống sốc',      'Balo laptop 15.6" chống sốc, chống nước.',                  500000, 'https://loremflickr.com/500/400/laptop,backpack?lock=12',12, 4.5, 176)
) AS v(catname, name, description, price, image_url, display_order, average_rating, total_reviews)
JOIN categories c ON c.name = v.catname
WHERE NOT EXISTS (SELECT 1 FROM products);

-- 100 sản phẩm sinh thêm (display_order 101..200)
-- Tên = prefix + brand[i%12] + variant[(i*3)%8]; giá = baseprice + (i%12)*step theo danh mục;
-- ảnh loremflickr theo tag của template.
INSERT INTO products (category_id, name, description, price, image_url, available, display_order, average_rating, total_reviews, created_at, updated_at)
SELECT
  c.id,
  t.prefix || ' '
    || (ARRAY['Asus','Dell','HP','Lenovo','Acer','MSI','Apple','LG','Gigabyte','Huawei','Samsung','Microsoft'])[1 + (g.i % 12)]
    || ' '
    || (ARRAY['Pro','Air','Plus','Max','Ultra','Slim','Touch','2024'])[1 + ((g.i * 3) % 8)],
  t.descr,
  t.baseprice + (g.i % 12) * t.step,
  'https://loremflickr.com/500/400/' || t.tag || '?lock=' || g.i,
  true,
  100 + g.i,
  round((3.5 + random() * 1.5)::numeric, 1),
  (random() * 150)::int,
  NOW(), NOW()
FROM generate_series(1, 100) AS g(i)
JOIN (VALUES
  (0, 'Laptop Gaming',    'gaming,laptop',  'Laptop Gaming',    20000000, 2000000, 'Laptop gaming cấu hình mạnh, tản nhiệt tốt, màn tần số cao.'),
  (1, 'Laptop Văn phòng', 'laptop',         'Laptop Văn phòng', 12000000, 1500000, 'Laptop văn phòng mỏng nhẹ, pin lâu, phù hợp công việc.'),
  (2, 'Laptop Đồ hoạ',    'laptop',         'Laptop Đồ hoạ',    30000000, 3000000, 'Workstation cho thiết kế, dựng phim, màn hình chuẩn màu.'),
  (3, 'Ultrabook',        'laptop',         'Ultrabook',        18000000, 2000000, 'Ultrabook siêu mỏng nhẹ, di động cao, pin cả ngày.'),
  (4, 'Phụ kiện laptop',  'computer,mouse', 'Phụ kiện',         300000,   250000,  'Phụ kiện laptop chính hãng, bảo hành uy tín.')
) AS t(k, catname, tag, prefix, baseprice, step, descr) ON t.k = (g.i - 1) % 5
JOIN categories c ON c.name = t.catname
WHERE NOT EXISTS (SELECT 1 FROM products WHERE display_order > 100);

-- Đồng bộ sequence IDENTITY để insert sau này không đụng id
SELECT setval(pg_get_serial_sequence('products', 'id'), COALESCE((SELECT MAX(id) FROM products), 1), true);
SELECT setval(pg_get_serial_sequence('categories', 'id'), COALESCE((SELECT MAX(id) FROM categories), 1), true);
