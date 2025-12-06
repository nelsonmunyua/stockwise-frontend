import React, { useEffect, useState } from "react";
import axios from "axios";

const initialUserInfo = {
    id:"",
  username: "",
  email: "",
  password: "",
  role: "",
  is_active: false,
};

function EditUser(props) {
  const [userInfo, setUserInfo] = useState(initialUserInfo);

  useEffect(() => {
    setUserInfo({...userInfo, id: props.userId})
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/users/" + props.userId
    );

    if (response) {
      const u = response.data;

      setUserInfo({
        username: u.username,
        email: u.email,
        password: "",     // user must re-enter or leave blank
        role: u.role,
        is_active: u.is_active,
      });
    }
  } catch (e) {
    console.log(e);
  }
};


  const editExistUser = async () => {
  try {
    const payload = {
      username: userInfo.username,
      email: userInfo.email,
      password: userInfo.password,  // must match UserCreate
      role: userInfo.role,
      is_active: userInfo.is_active,
    };

    const response = await axios.put(
      `http://localhost:8000/users/${props.userId}`,
      payload
    );

    if (response) {
      props.setUserEdited();
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
      <button className="btn btn-success" onClick={() => editExistUser()}>
        Edit User
      </button>
    </div>
  );
}

export default EditUser;
