# 💻 DuongTech - Website bán Laptop (Microservices)

## 📖 Tổng quan

**DuongTech** là website thương mại điện tử chuyên bán **laptop** và phụ kiện (Gaming, Văn phòng, Đồ hoạ, Ultrabook, Phụ kiện), được xây dựng theo kiến trúc **Microservices** kết hợp **Domain-Driven Design (DDD)**.

- **Backend:** Spring Boot 3.2.1 (Java 17) + Spring Cloud, Netflix Eureka, Spring Cloud Gateway, RabbitMQ, PostgreSQL.
- **Frontend:** React 18 (Vite + TailwindCSS) — gồm website khách hàng và trang quản trị (Admin).

> ⚙️ Các cổng của DuongTech đã được đổi để có thể **chạy song song** với các shop khác trên cùng một máy. Container chạy dưới project name `duong` (tiền tố `duong-`).

---

## ✨ Tính năng

### 🛍️ Website khách hàng (Customer App)
- Xem sản phẩm theo **danh mục** (Gaming, Văn phòng, Đồ hoạ, Ultrabook, Phụ kiện), tìm kiếm, lọc và **phân trang**.
- Xem chi tiết cấu hình laptop, hình ảnh, giá.
- **So sánh cấu hình** nhiều sản phẩm cạnh nhau.
- **Tính trả góp** theo kỳ hạn.
- **Giỏ hàng** (thêm/sửa/xoá, lưu localStorage).
- **Đặt hàng** và thanh toán **COD** hoặc **chuyển khoản QR (SePay)**.
- **Đánh giá** sản phẩm.
- Thông báo realtime (WebSocket/STOMP) khi trạng thái đơn hàng thay đổi.

### 🎛️ Trang quản trị (Admin Panel)
- **Tổng quan (Dashboard):** thống kê đơn hàng, doanh thu, người dùng, biểu đồ (Recharts).
- **Đơn hàng:** xem, lọc theo trạng thái, cập nhật trạng thái.
- **Sản phẩm:** quản lý (CRUD) laptop/phụ kiện, giá, tồn, hiển thị.
- **Danh mục:** quản lý danh mục sản phẩm.
- **Tồn kho:** theo dõi và cập nhật số lượng tồn.
- **Người dùng:** danh sách và vai trò (Admin/Staff/Customer).

> Ví dụ sản phẩm minh hoạ: Asus ROG, Dell XPS, MacBook Air, ThinkPad, chuột, balo laptop...

---

## 🏗️ Kiến trúc & cổng dịch vụ

| Thành phần | Cổng (host) | Vai trò |
|------------|-------------|---------|
| **Eureka Server** | 9761 | Service Discovery |
| **API Gateway** | 9080 | Routing, CORS, điểm vào duy nhất |
| **service-auth** | 9081 | Authentication & Authorization (JWT) |
| **service-menu** | 9082 | Quản lý sản phẩm & danh mục |
| **service-order** | 9083 | Quản lý đơn hàng |
| **service-payment** | 9084 | Thanh toán (COD / SePay QR) |
| **service-inventory** | 9085 | Quản lý tồn kho |
| **service-notification** | 9086 | Thông báo (email/log) |
| **service-socket** | 9089 | WebSocket realtime |
| **RabbitMQ** | 6672 / 16672 | Message Broker / Management UI |
| **PostgreSQL** | 6433–6438 | 6 database (mỗi service một DB) |

**Frontend:**

| Ứng dụng | Cổng | URL |
|----------|------|-----|
| Customer App | 3001 | http://localhost:3001 |
| Admin Panel | 3003 | http://localhost:3003 |

```
Customer App (3001)  Admin Panel (3003)
        \                 /
         ▼               ▼
        API Gateway (9080)
                │
        Eureka Server (9761) ───► service-auth (9081), service-menu (9082),
                │                  service-order (9083), service-payment (9084),
             RabbitMQ              service-inventory (9085), service-notification (9086),
           (6672/16672)           service-socket (9089)
                                          │
                                   PostgreSQL x6 (6433–6438)
```

---

## 🛠️ Công nghệ

- **Java 17**, **Spring Boot 3.2.1**, **Spring Cloud 2023.0.0**, **Maven**
- **Netflix Eureka** (Service Discovery), **Spring Cloud Gateway** (API Gateway)
- **RabbitMQ** (Message Broker), **PostgreSQL 15** (Database per service)
- **Spring Data JPA / Hibernate**, **Spring Security**, **JWT (JJWT)**, **Lombok**
- **React 18 + Vite + TailwindCSS**, **Axios**, **Recharts**, **WebSocket (STOMP/SockJS)**
- **Docker & Docker Compose**, **Swagger/OpenAPI 3**

---

## 🚀 Hướng dẫn chạy

### Yêu cầu
- Docker Desktop (bắt buộc cho backend)
- Node.js LTS (18/20) cho frontend
- Git

### 1. Tải mã nguồn
```bash
git clone <repository-url>
cd Duong
```

### 2. Chạy Backend (Docker Compose)
Toàn bộ backend (Eureka, Gateway, 7 service, RabbitMQ, 6 PostgreSQL) chạy dưới project name `duong`:

```bash
docker compose -p duong up -d --build
```
Lần đầu build có thể mất vài phút (~1–2 phút). Kiểm tra trạng thái: `docker compose -p duong ps`.

> 📦 **Dữ liệu mẫu tự nạp:** Ngay lần chạy đầu tiên, backend tự động nạp dữ liệu demo — **112 laptop** (5 danh mục), **17 đơn hàng** và **tồn kho** — nhờ cơ chế `data.sql` của Spring Boot. Không cần import thủ công. Cơ chế idempotent: chỉ nạp khi database còn rỗng, chạy lại `up` sẽ không tạo trùng.

Truy cập kiểm tra:
- **Eureka Dashboard:** http://localhost:9761
- **API Gateway health:** http://localhost:9080/actuator/health
- **RabbitMQ Management:** http://localhost:16672 (guest / guest)
- **Swagger (auth):** http://localhost:9081/swagger-ui.html

### 3. Chạy Frontend
Mở 2 terminal riêng:

```bash
# Website khách hàng
cd frontend
npm install
npm run dev          # http://localhost:3001

# Trang quản trị
cd frontend-admin
npm install
npm run dev          # http://localhost:3003
```
Cả hai app proxy `/api` tới API Gateway `http://localhost:9080`.

---

## 🔗 URL truy cập

| Ứng dụng | URL |
|----------|-----|
| Customer App | http://localhost:3001 |
| Admin Panel | http://localhost:3003 |
| API Gateway | http://localhost:9080 |
| Eureka | http://localhost:9761 |
| RabbitMQ | http://localhost:16672 |

---

## 👤 Tài khoản Admin (demo)

```
Email:    admin@duongtech.com
Password: admin123
Role:     ADMIN
```
> Tài khoản phải có role `ADMIN` mới đăng nhập được Admin Panel. Xem thêm `ADMIN_USER_SETUP.md`.

---

## 🗂️ Cấu trúc DDD (mỗi microservice)

```
service-name/
├── domain/                  # Business logic core (model, repository interface, service)
├── application/             # Use cases + DTO
├── infrastructure/          # JPA repository, RabbitMQ, config
└── interfaces/              # REST controllers
```

**Quy tắc:** Controller → UseCase → Domain → Repository. Xem chi tiết tại [PROJECT_RULES_AND_STANDARDS.md](PROJECT_RULES_AND_STANDARDS.md).

---

## 🐳 Lệnh Docker thường dùng

```bash
# Khởi động
docker compose -p duong up -d

# Xem logs
docker compose -p duong logs -f

# Dừng
docker compose -p duong down

# Rebuild một service
docker compose -p duong up -d --build service-auth

# Xoá volumes (reset database)
docker compose -p duong down -v
```

---

**Version:** 2.0.0  
**Status:** ✅ Active
