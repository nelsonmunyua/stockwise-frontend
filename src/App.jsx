import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

// Import components
import Users from './Users/Users';
import Categories from './Categories/Categories';
import Products from './Products/Products';
import Orders from './Orders/Orders';

function App() {
  const [activeTab, setActiveTab] = useState('users');

  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => setActiveTab('dashboard')
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      command: () => setActiveTab('users')
    },
    {
      label: 'Categories',
      icon: 'pi pi-tags',
      command: () => setActiveTab('categories')
    },
    {
      label: 'Products',
      icon: 'pi pi-box',
      command: () => setActiveTab('products')
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-cart',
      command: () => setActiveTab('orders')
    }
  ];

  const start = <img src="/logo.png" alt="StockWise" height="40" className="mr-2" />;

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <i className="pi pi-chart-line me-2"></i>
              StockWise
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/categories">Categories</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">Products</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">Orders</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={
              <div className="text-center mt-5">
                <h1>Welcome to StockWise</h1>
                <p className="lead">Smart Inventory & Sales Management System</p>
                <div className="row mt-5">
                  <div className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5><i className="pi pi-users text-primary"></i> Users</h5>
                        <p>Manage user accounts and permissions</p>
                        <Link to="/users" className="btn btn-primary">Go to Users</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5><i className="pi pi-tags text-success"></i> Categories</h5>
                        <p>Organize products by categories</p>
                        <Link to="/categories" className="btn btn-success">Go to Categories</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5><i className="pi pi-box text-warning"></i> Products</h5>
                        <p>Manage inventory and product details</p>
                        <Link to="/products" className="btn btn-warning">Go to Products</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5><i className="pi pi-shopping-cart text-danger"></i> Orders</h5>
                        <p>Create and track sales orders</p>
                        <Link to="/orders" className="btn btn-danger">Go to Orders</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/users" element={<Users />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>

        <footer className="bg-dark text-white mt-5 py-3">
          <div className="container text-center">
            <p>StockWise &copy; {new Date().getFullYear()} - Smart Inventory Management System</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;