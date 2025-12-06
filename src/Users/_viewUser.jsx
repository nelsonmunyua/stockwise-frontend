import React, { useEffect, useState } from "react";
import axios from "axios";

const initialUserInfo = {
  username: "",
  email: "",
  role: "",
  is_active: false,
};

const apiUrl = import.meta.env.VITE_API_URL;

function ViewUser({ userId }) {
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/users/${id}`);
      if (response.status === 200) {
        setUserInfo(response.data);
      }
    } catch (e) {
      console.error("Failed to fetch user:", e);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="user-view">
      <h1>Basic Info</h1>
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <p>
            <strong>Username:</strong> {userInfo.username || "N/A"}
          </p>
        </div>
        <div className="col-sm-12 col-md-6">
          <p>
            <strong>Email:</strong> {userInfo.email || "N/A"}
          </p>
        </div>
        <div className="col-sm-12 col-md-6">
          <p>
            <strong>Role:</strong> {userInfo.role || "N/A"}
          </p>
        </div>
        <div className="col-sm-12 col-md-6">
          <p>
            <strong>Active:</strong>{" "}
            {userInfo.is_active !== undefined
              ? userInfo.is_active
                ? "Yes"
                : "No"
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;
