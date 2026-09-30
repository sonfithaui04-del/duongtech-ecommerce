-- =====================================================================
-- DuongTech · service-payment
-- Tệp này không nạp dữ liệu mẫu, chỉ làm một việc: nới rộng cột số tiền.
-- Cột amount trước đây là numeric(10,2) nên chỉ chứa được tới 99.999.999đ;
-- một đơn vài chiếc laptop đã vượt mốc đó và lệnh tạo thanh toán sẽ lỗi.
-- Hibernate với ddl-auto: update không tự đổi kiểu cột đang có, nên phải ghi rõ ở đây.
-- Trên CSDL tạo mới, câu lệnh này không làm thay đổi gì.
-- =====================================================================

ALTER TABLE IF EXISTS payments ALTER COLUMN amount TYPE numeric(15,2);
