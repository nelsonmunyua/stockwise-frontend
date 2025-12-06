import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const apiUrl = import.meta.env.VITE_API_URL; // <--- API base URL

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMode, setShowAddMode] = useState(false);
  const [showEditMode, setShowEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category_id: ""
  });

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`);
      setProducts(response.data);
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      setLoading(false);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories`);
      setCategories(response.data);
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "quantity" || name === "category_id"
        ? parseInt(value) || 0
        : value
    }));
  };

  const addProduct = async () => {
    try {
      await axios.post(`${apiUrl}/products`, formData);
      getAllProducts();
      setShowAddMode(false);
      setFormData({ name: "", price: "", quantity: "", category_id: "" });
    } catch (e) {
      console.error("Failed to add product:", e);
      alert(e.response?.data?.detail || "Failed to add product");
    }
  };

  const editProduct = async () => {
    try {
      await axios.put(`${apiUrl}/products/${selectedProduct.id}`, formData);
      getAllProducts();
      setShowEditMode(false);
      setSelectedProduct(null);
      setFormData({ name: "", price: "", quantity: "", category_id: "" });
    } catch (e) {
      console.error("Failed to edit product:", e);
      alert(e.response?.data?.detail || "Failed to edit product");
    }
  };

  const deleteProductConfirm = (product) => {
    confirmDialog({
      message: `Are you sure you want to delete "${product.name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteProduct(product.id),
    });
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${apiUrl}/products/${productId}`);
      getAllProducts();
    } catch (e) {
      console.error("Failed to delete product:", e);
      alert(e.response?.data?.detail || "Failed to delete product");
    }
  };

  const priceTemplate = (rowData) => `$${rowData.price.toFixed(2)}`;
  const categoryTemplate = (rowData) => rowData.category_name || "N/A";
  const stockTemplate = (rowData) => {
    const stockClass = rowData.quantity < 10 ? "text-danger fw-bold" : "";
    return <span className={stockClass}>{rowData.quantity}</span>;
  };

  const actionsTemplate = (rowData) => (
    <>
      <button
        className="btn btn-primary btn-sm me-2"
        onClick={() => {
          setSelectedProduct(rowData);
          setFormData({
            name: rowData.name,
            price: rowData.price,
            quantity: rowData.quantity,
            category_id: rowData.category_id
          });
          setShowEditMode(true);
        }}
      >
        <i className="pi pi-pencil"></i> Edit
      </button>
      <button className="btn btn-danger btn-sm" onClick={() => deleteProductConfirm(rowData)}>
        <i className="pi pi-trash"></i> Delete
      </button>
    </>
  );

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Products</h2>
          <button
            className="btn btn-success"
            onClick={() => {
              setFormData({ name: "", price: "", quantity: "", category_id: "" });
              setShowAddMode(true);
            }}
          >
            <i className="pi pi-plus me-2"></i>Add Product
          </button>
        </div>
        <div className="card-body">
          <DataTable value={products} paginator rows={10} loading={loading} emptyMessage="No products found.">
            <Column field="id" header="ID" sortable />
            <Column field="name" header="Name" sortable />
            <Column field="price" header="Price" body={priceTemplate} sortable />
            <Column field="quantity" header="Stock" body={stockTemplate} sortable />
            <Column field="category_name" header="Category" body={categoryTemplate} sortable />
            <Column header="Actions" body={actionsTemplate} />
          </DataTable>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog
        header="Add Product"
        visible={showAddMode}
        style={{ width: "50vw" }}
        onHide={() => setShowAddMode(false)}
        footer={
          <div>
            <button className="btn btn-secondary" onClick={() => setShowAddMode(false)}>Cancel</button>
            <button className="btn btn-success ms-2" onClick={addProduct}>Add</button>
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="name">Product Name *</label>
            <input id="name" name="name" type="text" className="form-control" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="price">Price ($) *</label>
              <input id="price" name="price" type="number" className="form-control" value={formData.price} onChange={handleInputChange} min="0" step="0.01" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="quantity">Quantity *</label>
              <input id="quantity" name="quantity" type="number" className="form-control" value={formData.quantity} onChange={handleInputChange} min="0" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="category_id">Category *</label>
            <select id="category_id" name="category_id" className="form-control" value={formData.category_id} onChange={handleInputChange} required>
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        header="Edit Product"
        visible={showEditMode}
        style={{ width: "50vw" }}
        onHide={() => setShowEditMode(false)}
        footer={
          <div>
            <button className="btn btn-secondary" onClick={() => setShowEditMode(false)}>Cancel</button>
            <button className="btn btn-success ms-2" onClick={editProduct}>Update</button>
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="name">Product Name *</label>
            <input id="name" name="name" type="text" className="form-control" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="price">Price ($) *</label>
              <input id="price" name="price" type="number" className="form-control" value={formData.price} onChange={handleInputChange} min="0" step="0.01" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="quantity">Quantity *</label>
              <input id="quantity" name="quantity" type="number" className="form-control" value={formData.quantity} onChange={handleInputChange} min="0" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="category_id">Category *</label>
            <select id="category_id" name="category_id" className="form-control" value={formData.category_id} onChange={handleInputChange} required>
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
}

export default Products;
