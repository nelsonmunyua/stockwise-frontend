import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from 'axios';

import { Dialog } from 'primereact/dialog';
import ViewUser from "./_viewUser";
import AddUser from "./_addUser";
import EditUser from "./_editUser";
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog'; 
 
 

function Users() {
  const [users, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewMode, setShowViewMode] = useState(false);
    const [showEditMode, setShowEditMode] = useState(false);

  const [showAddMode, setShowAddMode] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      setUsersList(response.data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setLoading(false);
    }
  };

  const actionsTemplate = (rowDate) => {
    return (
     <>
      <button className="btn btn-success" onClick={() => {
        setSelectedUserId(rowDate.id)
        setShowViewMode(true)
      }}>
        <i className="pi pi-eye"></i>
      </button>

       <button className="btn btn-primary" onClick={() => {
        setSelectedUserId(rowDate.id)
        setShowEditMode(true)
      }}>
        <i className="pi pi-file-edit"></i>
      </button>
       <button className="btn btn-danger" onClick={() => deleteUserConfirm(rowDate.id)}>
        <i className="pi pi-trash"></i>
      </button>
      </>
    )
  } 

  const deleteUserConfirm = (userId) => {
    confirmDialog({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteUser(userId),
        // reject: () => rejectFunc()
    });
}

const deleteUser = async (userId) => {
  try{
    const response = await axios.delete(`${apiUrl}/users/${userId}`);
    if(response) {
      getAllUsers();
    }
  }
  catch (e){
    console.log(e)
  }
}

  return (
    <div className="users-page">
      <div className="container">
        <h1>All User</h1>
        <h3>Users page</h3>

        <div className="users-list">
          <div className="addNewUser">
            <button className="btn btn-success" onClick={() => setShowAddMode(true)}>Add New User
              <i className="pi pi-plus"></i>
              </button>
          </div>
          <DataTable value={users} responsiveLayout="scroll" loading={loading}>
            <Column field="id" header="Id"></Column>
            <Column field="username" header="Username"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="role" header="Role"></Column>
            <Column field="is_active" header="Is_active"></Column>
            <Column field="created_at" header="Created_at"></Column>
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        header="View User Data"
        visible={showViewMode}
        style={{ width: "70vw" }}
        onHide={() => setShowViewMode(false)}
      >
       <ViewUser userId={selectedUserId} />

      </Dialog>

      <Dialog
        header="Add New User"
        visible={showAddMode}
        style={{ width: "70vw" }}
        onHide={() => setShowAddMode(false)}
      >
       <AddUser setUserAdded={() => {
        setShowAddMode(false);
        getAllUsers();

       }}/>

      </Dialog>

      <Dialog
        header="Edit Exist User"
        visible={showEditMode}
        style={{ width: "70vw" }}
        onHide={() => setShowEditMode(false)}
      >
       <EditUser userId={selectedUserId} setUserEdited={() => {
        setShowEditMode(false);
        getAllUsers();
       }}/>

      </Dialog>

      <ConfirmDialog />
    </div>
  );
}

export default Users;   