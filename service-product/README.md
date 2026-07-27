# Product Service

## 📋 Mô tả
Service quản lý products và categories cho hệ thống DuongTech.

## 🔧 Công nghệ
- Spring Boot 3.2.1
- Spring Data JPA
- PostgreSQL
- Netflix Eureka Client
- Swagger/OpenAPI 3
- Java 17

## 🏗️ Kiến trúc DDD

```
service-product/
├── domain/              # Business Logic Layer
│   ├── model/          # Entities (Category, Product)
│   └── repository/     # Repository Interfaces
├── application/         # Use Cases Layer
│   ├── usecase/        # Business use cases
│   └── dto/            # Data Transfer Objects
├── infrastructure/      # Technical Layer
│   ├── repository/     # JPA Implementations
│   └── config/         # Configurations
└── interfaces/          # API Layer
    └── controller/     # REST Controllers
```

## 🚀 Cách chạy

### Prerequisites
- Java 17
- PostgreSQL
- Maven

### 1. Cấu hình Database
```sql
CREATE DATABASE duongtech_product;
```

### 2. Chạy Service
```bash
mvn spring-boot:run
```

## 🌐 API Endpoints

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Lấy tất cả categories |
| GET | `/categories?activeOnly=true` | Lấy active categories |
| POST | `/categories` | Tạo category mới |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Lấy tất cả products |
| GET | `/products?availableOnly=true` | Lấy sản phẩm đang bán |
| POST | `/products` | Tạo sản phẩm mới |

## 📊 Swagger UI
http://localhost:9082/swagger-ui.html

## 📝 Example Requests

### Create Category
```bash
curl -X POST http://localhost:9082/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "description": "Laptop chơi game hiệu năng cao",
    "displayOrder": 1
  }'
```

### Create Product
```bash
curl -X POST http://localhost:9082/products \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "name": "Asus ROG Strix G16",
    "description": "Laptop gaming RTX 4060, 16GB RAM, màn 165Hz",
    "price": 32000000,
    "imageUrl": "https://example.com/rog-strix.jpg"
  }'
```

### Get All Products
```bash
curl http://localhost:9082/products
```

## ⚙️ Configuration

- **Port**: 9082
- **Database**: PostgreSQL (localhost:6433)
- **Eureka Server**: http://localhost:9761/eureka/
- **Service Name**: service-product

## 📌 Database Schema

### categories
- id (PK)
- name
- description
- display_order
- active
- created_at
- updated_at

### products
- id (PK)
- category_id (FK)
- name
- description
- price
- image_url
- available
- display_order
- created_at
- updated_at

## 🔗 Dependencies
- Eureka Server (localhost:9761)
- PostgreSQL (localhost:6433)
