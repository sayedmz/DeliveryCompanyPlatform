import React, { useState } from "react";
import axios from "axios";
import "../css/login.css"; // نستعمل نفس التصميم
import { API_BASE } from "../api/api";

function Register() {
  const [form, setForm] = useState({
    fName: "",
    lName: "",
    phone: "",
    email: "",
    password: "",
    // role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  //   console.log(handleChange);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const res = await axios.post("http://localhost:8000/api/register", form, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   withCredentials: true, // من اجل استلام توكن بال كوكي من باك
      // });
      const res = await axios.post(`${API_BASE}/register`, form, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res);
      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <label>First Name</label>
        <input
          type="text"
          name="fName"
          value={form.fName}
          onChange={handleChange}
          placeholder="Enter your first name..."
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          name="lName"
          value={form.lName}
          onChange={handleChange}
          placeholder="Enter your last name..."
          required
        />

        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone..."
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email..."
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password..."
          required
          minLength="6"
        />
        {/* <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="" disabled hidden>
            Select Role
          </option>
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select> */}
        {/* <input
          type="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Enter your role admin or user..."
          required
          minLength="5"
        /> */}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
