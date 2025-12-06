import React, { useEffect, useState } from "react";
import axios from "axios";

const initialUserInfo = {
  username: "",
  email: "",
  password: "",
  role: "",
  is_active: false,
};

function AddUser(props) {
  const [userInfo, setUserInfo] = useState(initialUserInfo);

  useEffect(() => {}, []);

  const addNewUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/users",
        userInfo
      );
      if (response) {
        props.setUserAdded();
      }
    } catch (e) {
      console.log(e);
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
              type="text"
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
      <button className="btn btn-success" onClick={() => addNewUser()}>
        Add New User
      </button>
    </div>
  );
}

export default AddUser;
