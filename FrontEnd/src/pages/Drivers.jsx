// src/pages/Drivers.jsx
import React, { useEffect, useState, useMemo } from "react";
import "../css/driver.css";
import axios from "axios";
import { API_BASE } from "../api/api";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // const res = await axios.get("http://localhost:8000/api/drivers", {
        //   withCredentials: true,
        // });
        const res = await axios.get(`${API_BASE}/drivers`, {
          withCredentials: true,
        });
        // console.log("res" + res);
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        // console.log(list);
        setDrivers(list);
      } catch (e) {
        console.error(
          "DRIVERS_ERROR",
          e?.response?.status,
          e?.response?.data || e.message,
        );
        setErr(
          e?.response?.data?.message ||
            "Failed to load drivers. Check API/CORS.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const filtered = useMemo(() => {
    const base = Array.isArray(drivers) ? drivers : [];
    if (!q) return base;
    const s = q.toLowerCase();
    return base.filter(
      (u) =>
        (u?.fName && u.fName.toLowerCase().includes(s)) ||
        (u?.lName && u.lName.toLowerCase().includes(s)) ||
        (u?.email && u.email.toLowerCase().includes(s)) ||
        (u?.phone && String(u.phone).includes(s)),
    );
  }, [q, drivers]);

  const totalCount = Array.isArray(filtered) ? filtered.length : 0;

  const safeDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  const deleteDriver = async (userID) => {
    const ok = window.confirm("Are you sure you want to delete this driver?");

    if (!ok) return;

    try {
      await axios.delete(`${API_BASE}/drivers/${userID}`, {
        withCredentials: true,
      });

      setDrivers((prev) => prev.filter((driver) => driver.userID !== userID));
    } catch (e) {
      console.error(
        "DELETE_DRIVER_ERROR",
        e?.response?.status,
        e?.response?.data || e.message,
      );

      setErr(e?.response?.data?.message || "Failed to delete driver.");
    }
  };

  return (
    <div className="drivers-wrap">
      <div className="drivers-head">
        <h2>Drivers</h2>
        <div className="drivers-actions">
          <input
            className="drivers-search"
            placeholder="Search name, email, phone…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="pill">{totalCount} total</span>
        </div>
      </div>

      {loading && <div className="state note">Loading…</div>}
      {err && !loading && <div className="state error">{err}</div>}

      {!loading && !err && (
        <div className="drivers-card">
          <table className="drivers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filtered) && filtered.length > 0 ? (
                filtered.map((u) => (
                  <tr key={u?.userID ?? u?.id}>
                    <td>#{u?.userID ?? u?.id ?? "-"}</td>
                    <td>{(u?.fName ?? "") + " " + (u?.lName ?? "")}</td>
                    <td>{u?.phone || "-"}</td>
                    <td className="email">{u?.email || "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          u?.role === "admin" ? "admin" : "user"
                        }`}
                      >
                        {u?.role || "-"}
                      </span>
                    </td>
                    <td>{safeDate(u?.created_at)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteDriver(u.userID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty">
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Drivers;
