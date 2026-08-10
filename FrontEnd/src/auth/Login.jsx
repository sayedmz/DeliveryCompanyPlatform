import React, { useState } from "react";
import axios from "axios";
import "../css/login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  // const [user, setUser] = useState(null);
  //const [tokenPreview, setTokenPreview] = useState(null); // 👈 نعرض جزء فقط من التوكن
  const { user, setUser } = useAuth(); // 👈 استعمل الـContext لتخزين معلومات المستخدم

  const nav = useNavigate(); // للانتقال بدون reflsh

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        form,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // ✅ مهم جدًا لإرسال واستقبال الكوكي
        },
      );

      const { user } = response.data;
      console.log(user);
      setUser(user);
      // setTokenPreview(token_preview);
      // window.location.href = "/dashboard";
      nav("/dashboard");
      // alert("✅ Login successful!");
      // console.log("User:", user);
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.status);
      console.error("LOGIN RESPONSE:", err.response?.data);
      console.error("LOGIN FULL ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Login failed. Check Laravel terminal and browser console.",
      );
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email..."
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password..."
          required
        />

        <button type="submit">Login</button>
      </form>

      {user && (
        <div style={{ marginTop: "20px", color: "white" }}>
          <p>
            Welcome <strong>{user.fName}</strong>!
          </p>
          {/* <p>Email: {user.email}</p> */}
          {/* <p>Token (preview): {tokenPreview}</p> */}
        </div>
      )}
    </div>
  );
}

export default Login;
