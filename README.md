📦 StockWise — Inventory Management System

StockWise is a simple full-stack inventory management system built using:

Frontend: React

Backend: FastAPI

Database: SQLite

ORM: SQLAlchemy

Migrations: Alembic

This MVP allows users to manage categories, products, orders, and order items with clean API endpoints and a simple architecture suitable for learning and portfolio projects.

🚀 Features (MVP)
✅ User Management

Register users

Login (JWT optional)

Users have roles: admin, staff

Users can place orders

✅ Category Management

Create categories

View all categories

Delete categories

Category → Products (1-to-many)

✅ Product Management

Add new products

Assign product to category

Update quantity and pricing

Soft delete (optional)

✅ Orders

A user can create an order

Order belongs to a single user

Calculates totals automatically

✅ Order Items

Each order has multiple items

Subtotals auto-calculated

Product price taken from DB

🏛 Database Models
Users
Field	Type
id	Integer (PK)
username	Text
email	Text
hashed_password	Text
role	Text
is_active	Boolean
created_at	DateTime
Category
Field	Type
id	Integer (PK)
name	Text
description	Text (optional)

Relationship:

Category has many Products

Product
Field	Type
id	Integer (PK)
name	Text
price	Integer
quantity	Integer
category_id	FK → category.id

Relationship:

Product → Category (many-to-one)

Product → OrderItems (many-to-many via order_items)

Orders
Field	Type
id	Integer (PK)
created_at	DateTime
total_amount	Integer
user_id	FK → users.id
Order Items
Field	Type
id	Integer (PK)
product_id	FK → product.id
order_id	FK → orders.id
quantity	Integer
subtotal	Integer
📁 Project Structure
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

⚙️ Backend Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/your-username/stockwise.git
cd stockwise/backend

2️⃣ Create virtual environment
python3 -m venv venv
source venv/bin/activate

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ Run migrations (Alembic)
alembic upgrade head

5️⃣ Start the FastAPI server
uvicorn main:app --reload


Backend will run at:

➡ http://127.0.0.1:8000

API Docs available at:

➡ http://127.0.0.1:8000/docs

🖥 Frontend Setup (React)

Inside /frontend:

1️⃣ Install dependencies
npm install

2️⃣ Start development server
npm start


App runs on:

➡ http://localhost:3000

🧪 API Endpoints Overview
Users
POST /users/register
POST /users/login
GET  /users/

Categories
GET /categories/
POST /categories/
DELETE /categories/{id}

Products
GET /products/
POST /products/
GET /products/{id}
DELETE /products/{id}

Orders
GET /orders/
POST /orders/
GET /orders/{id}
DELETE /orders/{id}

Order Items
POST /order-items/
GET /order-items/{order_id}

📌 Future Improvements

JWT Authentication

Role-based access control

Low-stock alerts

Inventory analytics dashboard

Export reports (PDF/CSV)

📜 License

MIT License – free to use for personal or educational projects