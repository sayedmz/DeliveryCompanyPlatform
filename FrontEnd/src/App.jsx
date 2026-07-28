// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./auth/login";
import Register from "./auth/Register";
import Home from "./home";
import Dashboard from "./Dashboard/Dashboard";
import Drivers from "./pages/Drivers";
import Orders from "./pages/Orders";
import AddOrders from "./pages/AddOrders";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="register" element={<Register />} />
          <Route path="driver" element={<Drivers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="addOrder" element={<AddOrders />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
