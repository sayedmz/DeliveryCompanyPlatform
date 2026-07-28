// src/pages/AddOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/addOrder.css";

function AddOrders() {
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    driverId: "",
    orderName: "",
    orderAddress: "",
    customerName: "",
    customerPhone: "",
    totalPrice: "",
    deliveryPrice: "",
    status: "pending",
    currency: "usd",
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/drivers", {
          withCredentials: true,
        });
        // console.log(res);
        // console.log(res.data);
        // console.log(res.data.data);
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setDrivers(list);
      } catch (e) {
        console.error("DRIVERS_ERROR", e);
        setErr("Failed to load drivers list.");
      } finally {
        setLoadingDrivers(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        driverId: form.driverId ? Number(form.driverId) : null,
        orderName: form.orderName,
        orderAddress: form.orderAddress,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        totalPrice: Number(form.totalPrice),
        deliveryPrice: Number(form.deliveryPrice),
        status: form.status,
        currency: form.currency,
      };

      const res = await axios.post(
        "http://localhost:8000/api/orders",
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setSuccess("Order created successfully");

      // reset form (اختياري، لأننا راح نعمل redirect)
      setForm({
        driverId: "",
        orderName: "",
        orderAddress: "",
        customerName: "",
        customerPhone: "",
        totalPrice: "",
        deliveryPrice: "",
        status: "pending",
        currency: "usd",
      });

      // بعد النجاح → روح على صفحة الطلبات
      navigate("/dashboard/orders");
    } catch (e) {
      console.error("ORDER CREATE_ERROR", e?.response?.data || e.message);
      if (e?.response?.status === 422 && e?.response?.data?.errors) {
        const firstError = Object.values(e.response.data.errors)[0][0];
        setErr(firstError);
      } else {
        setErr(
          e?.response?.data?.message || "Failed to create order. Check API.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-order-page">
      <div className="add-order-overlay" />
      <div className="add-order-container">
        <div className="add-order-card">
          <div className="add-order-header">
            <h2>Add New Order</h2>
            <p>Create a new delivery order and assign it to a driver.</p>
          </div>

          {err && <div className="alert alert-error">{err}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form className="add-order-form" onSubmit={handleSubmit}>
            {/* السطر الأول */}
            <div className="form-grid">
              {/* Driver */}
              <div className="form-field">
                <label>Driver</label>
                {loadingDrivers ? (
                  <div className="small-note">Loading drivers…</div>
                ) : (
                  <select
                    name="driverId"
                    value={form.driverId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select driver…</option>
                    {Array.isArray(drivers) &&
                      drivers.map((d) => (
                        <option key={d.userID ?? d.id} value={d.userID ?? d.id}>
                          {(d.fName ?? "") + " " + (d.lName ?? "")}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {/* Status */}
              <div className="form-field">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* السطر الثاني */}
            <div className="form-grid">
              {/* Order Name */}
              <div className="form-field">
                <label>Order Name</label>
                <input
                  type="text"
                  name="orderName"
                  value={form.orderName}
                  onChange={handleChange}
                  placeholder="Ex: Pizza Order, Grocery, Pharmacy..."
                  required
                />
              </div>

              {/* Order Address */}
              <div className="form-field">
                <label>Order Address</label>
                <input
                  type="text"
                  name="orderAddress"
                  value={form.orderAddress}
                  onChange={handleChange}
                  placeholder="Ex: Beirut, Hamra Street..."
                  required
                />
              </div>
            </div>

            {/* السطر الثالث */}
            <div className="form-grid">
              {/* Customer Name */}
              <div className="form-field">
                <label>Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Customer full name"
                  required
                />
              </div>

              {/* Customer Phone */}
              <div className="form-field">
                <label>Customer Phone</label>
                <input
                  type="text"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  placeholder="Ex: 70123456"
                  required
                />
              </div>
            </div>

            {/* السطر الرابع */}
            <div className="form-grid">
              {/* Total Price */}
              <div className="form-field">
                <label>Total Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="totalPrice"
                  value={form.totalPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Delivery Price */}
              <div className="form-field">
                <label>Delivery Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="deliveryPrice"
                  value={form.deliveryPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* السطر الخامس */}
            <div className="form-grid">
              {/* Currency */}
              <div className="form-field">
                <label>Currency</label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  required
                >
                  <option value="usd">USD</option>
                  <option value="lbp">LBP</option>
                </select>
              </div>

              {/* زر الإرسال */}
              <div className="form-field form-actions">
                <button type="submit" disabled={loading || loadingDrivers}>
                  {loading ? "Saving…" : "Add Order"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddOrders;
