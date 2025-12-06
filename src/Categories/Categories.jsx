import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMode, setShowAddMode] = useState(false);
  const [showEditMode, setShowEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/categories");
      setCategories(response.data);
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addCategory = async () => {
    try {
      await axios.post("http://localhost:8000/categories", formData);
      getAllCategories();
      setShowAddMode(false);
      setFormData({ name: "", description: "" });
    } catch (e) {
      console.error("Failed to add category:", e);
    }
  };

  const editCategory = async () => {
    try {
      await axios.put(`http://localhost:8000/categories/${selectedCategory.id}`, formData);
      getAllCategories();
      setShowEditMode(false);
      setSelectedCategory(null);
      setFormData({ name: "", description: "" });
    } catch (e) {
      console.error("Failed to edit category:", e);
    }
  };

  const deleteCategoryConfirm = (category) => {
    confirmDialog({
      message: `Are you sure you want to delete "${category.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteCategory(category.id),
    });
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8000/categories/${categoryId}`);
      getAllCategories();
    } catch (e) {
      console.error("Failed to delete category:", e);
      alert(e.response?.data?.detail || "Failed to delete category");
    }
  };

  const actionsTemplate = (rowData) => {
    return (
      <>
        <button 
          className="btn btn-primary btn-sm me-2" 
          onClick={() => {
            setSelectedCategory(rowData);
            setFormData({ name: rowData.name, description: rowData.description || "" });
            setShowEditMode(true);
          }}
        >
          <i className="pi pi-pencil"></i> Edit
        </button>
        <button 
          className="btn btn-danger btn-sm" 
          onClick={() => deleteCategoryConfirm(rowData)}
        >
          <i className="pi pi-trash"></i> Delete
        </button>
      </>
    );
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Categories</h2>
          <button 
            className="btn btn-success" 
            onClick={() => {
              setFormData({ name: "", description: "" });
              setShowAddMode(true);
            }}
          >
            <i className="pi pi-plus me-2"></i>Add Category
          </button>
        </div>
        <div className="card-body">
          <DataTable 
            value={categories} 
            paginator 
            rows={10}
            loading={loading}
            emptyMessage="No categories found."
          >
            <Column field="id" header="ID" sortable></Column>
            <Column field="name" header="Name" sortable></Column>
            <Column field="description" header="Description"></Column>
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog 
        header="Add Category" 
        visible={showAddMode} 
        style={{ width: "50vw" }} 
        onHide={() => setShowAddMode(false)}
        footer={
          <div>
            <button className="btn btn-secondary" onClick={() => setShowAddMode(false)}>
              Cancel
            </button>
            <button className="btn btn-success ms-2" onClick={addCategory}>
              Add
            </button>
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog 
        header="Edit Category" 
        visible={showEditMode} 
        style={{ width: "50vw" }} 
        onHide={() => setShowEditMode(false)}
        footer={
          <div>
            <button className="btn btn-secondary" onClick={() => setShowEditMode(false)}>
              Cancel
            </button>
            <button className="btn btn-success ms-2" onClick={editCategory}>
              Update
            </button>
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
}

export default Categories;