import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateMode, setShowCreateMode] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newOrder, setNewOrder] = useState({
    user_id: "",
    items: []
  });
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    getAllOrders();
    getAllProducts();
    getAllUsers();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const inStockProducts = products.filter(p => p.quantity > 0);
      setAvailableProducts(inStockProducts);
    }
  }, [products]);

  const getAllOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/orders");
      setOrders(response.data);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setLoading(false);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/products");
      setProducts(response.data);
    } catch (e) {
      console.error("Failed to fetch products:", e);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data.filter(user => user.is_active));
    } catch (e) {
      console.error("Failed to fetch users:", e);
    }
  };

  const getOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:8000/orders/${orderId}`);
      setSelectedOrder(response.data);
      setShowOrderDetails(true);
    } catch (e) {
      console.error("Failed to fetch order details:", e);
    }
  };

  const handleAddItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1 }]
    }));
  };

  const handleRemoveItem = (index) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: field === 'quantity' ? parseInt(value) || 0 : value } : item
      )
    }));
  };

  const calculateTotal = () => {
    return newOrder.items.reduce((total, item) => {
      const product = products.find(p => p.id === parseInt(item.product_id));
      if (product) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const createOrder = async () => {
    try {
      // Validate
      if (!newOrder.user_id) {
        alert("Please select a user");
        return;
      }

      if (newOrder.items.length === 0) {
        alert("Please add at least one item to the order");
        return;
      }

      // Filter out items with no product selected
      const validItems = newOrder.items.filter(item => item.product_id && item.quantity > 0);
      
      if (validItems.length === 0) {
        alert("Please add valid items to the order");
        return;
      }

      const orderData = {
        user_id: parseInt(newOrder.user_id),
        items: validItems
      };

      const response = await axios.post("http://localhost:8000/orders", orderData);
      alert("Order created successfully!");
      setShowCreateMode(false);
      setNewOrder({ user_id: "", items: [] });
      getAllOrders();
      getAllProducts(); // Refresh product stock
    } catch (e) {
      console.error("Failed to create order:", e);
      alert(e.response?.data?.detail || "Failed to create order");
    }
  };

  const dateTemplate = (rowData) => {
    return new Date(rowData.created_at).toLocaleString();
  };

  const amountTemplate = (rowData) => {
    return `$${rowData.total_amount.toFixed(2)}`;
  };

  const actionsTemplate = (rowData) => {
    return (
      <button 
        className="btn btn-info btn-sm" 
        onClick={() => getOrderDetails(rowData.id)}
      >
        <i className="pi pi-eye me-1"></i>View Details
      </button>
    );
  };

  return (
    <div className="container mt-4">
      <TabView>
        <TabPanel header="Orders List">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Orders</h2>
              <button 
                className="btn btn-success" 
                onClick={() => setShowCreateMode(true)}
              >
                <i className="pi pi-plus me-2"></i>Create New Order
              </button>
            </div>
            <div className="card-body">
              <DataTable 
                value={orders} 
                paginator 
                rows={10}
                loading={loading}
                emptyMessage="No orders found."
              >
                <Column field="id" header="Order ID" sortable></Column>
                <Column field="created_at" header="Date" body={dateTemplate} sortable></Column>
                <Column field="total_amount" header="Total Amount" body={amountTemplate} sortable></Column>
                <Column field="username" header="User" sortable></Column>
                <Column header="Actions" body={actionsTemplate}></Column>
              </DataTable>
            </div>
          </div>
        </TabPanel>
      </TabView>

      {/* Create Order Dialog */}
      <Dialog 
        header="Create New Order" 
        visible={showCreateMode} 
        style={{ width: "70vw", maxHeight: "80vh" }} 
        onHide={() => {
          setShowCreateMode(false);
          setNewOrder({ user_id: "", items: [] });
        }}
        footer={
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Total: ${calculateTotal().toFixed(2)}</h4>
              <div>
                <button className="btn btn-secondary me-2" onClick={() => setShowCreateMode(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={createOrder}>
                  Create Order
                </button>
              </div>
            </div>
          </div>
        }
      >
        <div className="p-fluid">
          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="user_id">Customer/User *</label>
              <select
                id="user_id"
                className="form-control"
                value={newOrder.user_id}
                onChange={(e) => setNewOrder(prev => ({ ...prev, user_id: e.target.value }))}
                required
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button className="btn btn-primary" onClick={handleAddItem}>
                <i className="pi pi-plus me-2"></i>Add Product
              </button>
            </div>
          </div>

          <div className="mb-3">
            <h5>Order Items</h5>
            {newOrder.items.length === 0 ? (
              <p className="text-muted">No items added yet. Click "Add Product" to start.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newOrder.items.map((item, index) => {
                      const product = products.find(p => p.id === parseInt(item.product_id));
                      const subtotal = product ? product.price * item.quantity : 0;
                      
                      return (
                        <tr key={index}>
                          <td>
                            <select
                              className="form-control"
                              value={item.product_id}
                              onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                            >
                              <option value="">Select product</option>
                              {availableProducts.map(product => (
                                <option key={product.id} value={product.id}>
                                  {product.name} (Stock: {product.quantity})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {product ? `$${product.price.toFixed(2)}` : "-"}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              min="1"
                              max={product ? product.quantity : 1}
                            />
                          </td>
                          <td>
                            ${subtotal.toFixed(2)}
                          </td>
                          <td>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <i className="pi pi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog 
        header={`Order #${selectedOrder?.id} Details`} 
        visible={showOrderDetails} 
        style={{ width: "70vw" }} 
        onHide={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
      >
        {selectedOrder && (
          <div>
            <div className="row mb-4">
              <div className="col-md-6">
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <div className="col-md-6">
                <p><strong>User:</strong> {selectedOrder.username}</p>
                <p><strong>Total Amount:</strong> ${selectedOrder.total_amount.toFixed(2)}</p>
              </div>
            </div>

            <h5>Order Items</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default Orders;