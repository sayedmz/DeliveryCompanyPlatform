import React from "react";
import "../css/nav.css";
import axios from "axios";
import { API_BASE } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE}/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      console.log(response.data);

      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  return (
    <div className="navBar">
      <div className="brand">
        <span className="brand__name">SwiftDrop</span>
      </div>

      <div onClick={handleLogout}>logout</div>
    </div>
  );
}

export default NavBar;
