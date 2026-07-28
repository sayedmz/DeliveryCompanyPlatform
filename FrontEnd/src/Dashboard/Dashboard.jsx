import React from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import "../css/dashboard.css";

const Dashboard = () => {
  return (
    <div className="contDash">
      <NavBar />
      <div className="dashBody">
        <SideBar />
        <main className="dashContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
