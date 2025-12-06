import React, { useEffect, useState } from "react";
import axios from "axios";

const initialUserInfo = {
  username: "",
  email: "",
  role: "",
  is_active: false
};

function ViewUser(props) {
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/users/" + props.userId
      );
      if (response) {
        console.log(response.data);
        setUserInfo(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="user-view">
      <h1>Basic Info</h1>
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <p>
            <span>Username:</span>
            <span>{userInfo.username}</span>
          </p>
        </div>
        <div className="col-sm-12 col-md-6">
          <p>
            <span>Email:</span>
            <span>{userInfo.email}</span>
          </p>
        </div>

        <div className="col-sm-12 col-md-6">
          <p>
            <span>Role:</span>
            <span>{userInfo.role}</span>
          </p>
        </div>

        <div className="col-sm-12 col-md-6">
          <p>
            <span>Is Active:</span>{" "}
            <span>
              {userInfo.is_active !== undefined
                ? userInfo.is_active
                  ? "Yes"
                  : "No"
                : "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;
