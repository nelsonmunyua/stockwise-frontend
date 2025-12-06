import React, { useState } from "react";
import axios from "axios";

const initialUserInfo = {
  username: "",
  email: "",
  password: "",
  role: "",
  is_active: false,
};

const apiUrl = import.meta.env.VITE_API_URL; // <-- Environment variable for API

function AddUser({ setUserAdded }) {
  const [userInfo, setUserInfo] = useState(initialUserInfo);

  const addNewUser = async () => {
    try {
      const response = await axios.post(`${apiUrl}/users`, userInfo);
      if (response.status === 201 || response.status === 200) {
        alert("User added successfully!");
        setUserInfo(initialUserInfo); // Reset form
        setUserAdded(); // Callback to parent
      }
    } catch (e) {
      console.error("Failed to add user:", e);
      alert(e.response?.data?.detail || "Failed to add user");
    }
  };

  return (
    <div className="user-view _add-view">
      <h1>Basic Info</h1>
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <p>
            <span>Username:</span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              value={userInfo.username}
              onChange={(e) =>
                setUserInfo({ ...userInfo, username: e.target.value })
              }
            />
          </p>
        </div>

        <div className="col-sm-12 col-md-6">
          <p>
            <span>Email:</span>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
          </p>
        </div>

        <div className="col-sm-12 col-md-6">
          <p>
            <span>Password:</span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
          </p>
        </div>

        <div className="col-sm-12 col-md-6">
          <p>
            <span>Role:</span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Role"
              value={userInfo.role}
              onChange={(e) =>
                setUserInfo({ ...userInfo, role: e.target.value })
              }
            />
          </p>
        </div>

        <div className="col-sm-12 col-md-6">
          <p>
            <span>Is Active:</span>
            <select
              className="form-control"
              value={userInfo.is_active ? "true" : "false"}
              onChange={(e) =>
                setUserInfo({
                  ...userInfo,
                  is_active: e.target.value === "true",
                })
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </p>
        </div>
      </div>

      <button className="btn btn-success" onClick={addNewUser}>
        Add New User
      </button>
    </div>
  );
}

export default AddUser;
