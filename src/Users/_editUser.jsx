import React, { useEffect, useState } from "react";
import axios from "axios";

const initialUserInfo = {
  id: "",
  username: "",
  email: "",
  password: "",
  role: "",
  is_active: false,
};

const apiUrl = import.meta.env.VITE_API_URL;

function EditUser({ userId, setUserEdited }) {
  const [userInfo, setUserInfo] = useState(initialUserInfo);

  useEffect(() => {
    if (userId) {
      setUserInfo(prev => ({ ...prev, id: userId }));
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/users/${id}`);
      if (response.status === 200) {
        const u = response.data;
        setUserInfo({
          id: u.id,
          username: u.username,
          email: u.email,
          password: "", // user must re-enter or leave blank
          role: u.role,
          is_active: u.is_active,
        });
      }
    } catch (e) {
      console.error("Failed to fetch user data:", e);
      alert("Failed to fetch user data");
    }
  };

  const editExistUser = async () => {
    try {
      const payload = {
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password, // optional: only send if not empty
        role: userInfo.role,
        is_active: userInfo.is_active,
      };

      const response = await axios.put(`${apiUrl}/users/${userId}`, payload);

      if (response.status === 200) {
        alert("User updated successfully!");
        setUserEdited(); // Notify parent
      }
    } catch (e) {
      console.error("Failed to edit user:", e);
      alert(e.response?.data?.detail || "Failed to edit user");
    }
  };

  return (
    <div className="user-view _add-view">
      <h1>Edit User</h1>
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

      <button className="btn btn-success" onClick={editExistUser}>
        Update User
      </button>
    </div>
  );
}

export default EditUser;
