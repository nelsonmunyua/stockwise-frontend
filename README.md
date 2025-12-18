# 📦 StockWise — Inventory Management System

StockWise is a simple **full-stack inventory management system** built for learning and portfolio purposes.

* **Frontend:** React
* **Backend:** FastAPI
* **Database:** SQLite
* **ORM:** SQLAlchemy
* **Migrations:** Alembic

This MVP allows users to manage **categories, products, orders, and order items** through clean API endpoints and a simple, scalable architecture.

---

## 🚀 Features (MVP)

### ✅ User Management

* Register users
* Login (JWT optional)
* User roles: `admin`, `staff`
* Users can place orders

### ✅ Category Management

* Create categories
* View all categories
* Delete categories
* One-to-many relationship: **Category → Products**

### ✅ Product Management

* Add new products
* Assign products to categories
* Update quantity and pricing
* Soft delete (optional)

### ✅ Orders

* Users can create orders
* Each order belongs to a single user
* Order totals are calculated automatically

### ✅ Order Items

* Orders contain multiple items
* Subtotals calculated automatically
* Product prices fetched directly from the database

---

## 🏛 Database Models

### Users

| Field           | Type         |
| --------------- | ------------ |
| id              | Integer (PK) |
| username        | Text         |
| email           | Text         |
| hashed_password | Text         |
| role            | Text         |
| is_active       | Boolean      |
| created_at      | DateTime     |

---

### Category

| Field       | Type            |
| ----------- | --------------- |
| id          | Integer (PK)    |
| name        | Text            |
| description | Text (optional) |

**Relationship:**

* One Category has many Products

---

### Product

| Field       | Type             |
| ----------- | ---------------- |
| id          | Integer (PK)     |
| name        | Text             |
| price       | Integer          |
| quantity    | Integer          |
| category_id | FK → category.id |

**Relationships:**

* Many Products belong to one Category
* Products relate to Orders via Order Items

---

### Orders

| Field        | Type          |
| ------------ | ------------- |
| id           | Integer (PK)  |
| created_at   | DateTime      |
| total_amount | Integer       |
| user_id      | FK → users.id |

---

### Order Items

| Field      | Type            |
| ---------- | --------------- |
| id         | Integer (PK)    |
| product_id | FK → product.id |
| order_id   | FK → orders.id  |
| quantity   | Integer         |
| subtotal   | Integer         |

---

## 📁 Project Structure

```
backend/
│── models.py
│── database.py
│── main.py
│── schemas/
│   ├── user.py
│   ├── category.py
│   ├── product.py
│   ├── order.py
│   └── order_items.py
│── crud/
│   ├── user.py
│   ├── category.py
│   ├── product.py
│   ├── order.py
│   └── order_items.py
│── routes/
│   ├── users.py
│   ├── categories.py
│   ├── products.py
│   ├── orders.py
│   └── order_items.py
│── alembic/
└── requirements.txt
```

---

## ⚙️ Backend Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/nelsonmunyua/stockwise.git
cd stockwise/backend
```

### 2️⃣ Create a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run Database Migrations

```bash
alembic upgrade head
```

### 5️⃣ Start the FastAPI Server

```bash
uvicorn main:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

Interactive API Docs:

```
http://127.0.0.1:8000/docs
```

---

## 🖥 Frontend Setup (React)

Navigate to the `/frontend` directory:

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Start Development Server

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🧪 API Endpoints Overview

### Users

* `POST /users/register`
* `POST /users/login`
* `GET /users/`

### Categories

* `GET /categories/`
* `POST /categories/`
* `DELETE /categories/{id}`

### Products

* `GET /products/`
* `POST /products/`
* `GET /products/{id}`
* `DELETE /products/{id}`

### Orders

* `GET /orders/`
* `POST /orders/`
* `GET /orders/{id}`
* `DELETE /orders/{id}`

### Order Items

* `POST /order-items/`
* `GET /order-items/{order_id}`

---

## 📌 Future Improvements

* JWT Authentication
* Role-based access control
* Low-stock alerts
* Inventory analytics dashboard
* Export reports (PDF / CSV)

---

## 📜 License

MIT License — free to use for personal or educational projects.
