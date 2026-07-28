import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../css/orders.css";

const API_BASE = "http://localhost:8000/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setErr("");
      setLoading(true);

      try {
        const res = await axios.get(`${API_BASE}/orders`, {
          withCredentials: true,
        });

        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setOrders(list);
      } catch (e) {
        console.error(
          "ORDERS_ERROR",
          e?.response?.status,
          e?.response?.data || e.message,
        );
        setErr(
          e?.response?.data?.message ||
            "Failed to load orders. Check API/CORS.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const safeDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  const safeNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const money = (amount, currency) => {
    const n = safeNum(amount);
    const cur = (currency || "").toUpperCase();
    return `${n.toFixed(2)} ${cur || ""}`.trim();
  };

  const filtered = useMemo(() => {
    const base = Array.isArray(orders) ? orders : [];
    if (!q) return base;

    const s = q.toLowerCase();

    return base.filter((o) => {
      const driverName =
        `${o?.driver?.fName ?? ""} ${o?.driver?.lName ?? ""}`.trim() ||
        `${o?.driverName ?? ""}`.trim();

      return (
        String(o?.orderID ?? o?.id ?? "")
          .toLowerCase()
          .includes(s) ||
        (o?.orderName && o.orderName.toLowerCase().includes(s)) ||
        (o?.orderAddress && o.orderAddress.toLowerCase().includes(s)) ||
        (o?.customerName && o.customerName.toLowerCase().includes(s)) ||
        (o?.customerPhone && String(o.customerPhone).includes(s)) ||
        (driverName && driverName.toLowerCase().includes(s)) ||
        (o?.status && String(o.status).toLowerCase().includes(s)) ||
        (o?.currency && String(o.currency).toLowerCase().includes(s))
      );
    });
  }, [orders, q]);

  const stats = useMemo(() => {
    const list = Array.isArray(filtered) ? filtered : [];

    const delivered = list.filter((o) => o?.status === "delivered");
    const notDelivered = list.filter((o) => o?.status !== "delivered");

    // مجموع totalPrice حسب السائق + العملة للطلبات المسلمة فقط
    const perDriverCurrency = new Map();

    delivered.forEach((o) => {
      const driverName =
        `${o?.driver?.fName ?? ""} ${o?.driver?.lName ?? ""}`.trim() ||
        `Driver #${o?.driverId ?? "-"}`;

      const currency = (o?.currency || "unknown").toUpperCase();
      const key = `${driverName}__${currency}`;
      const prev = perDriverCurrency.get(key) || {
        driverName,
        currency,
        total: 0,
      };

      prev.total += safeNum(o?.totalPrice);
      perDriverCurrency.set(key, prev);
    });

    return {
      total: list.length,
      deliveredCount: delivered.length,
      notDeliveredCount: notDelivered.length,
      perDriverCurrency: [...perDriverCurrency.values()].sort(
        (a, b) => b.total - a.total,
      ),
    };
  }, [filtered]);

  const markDelivered = async (orderID) => {
    setErr("");

    const originalOrders = [...orders];

    setOrders((prev) =>
      prev.map((o) =>
        (o?.orderID ?? o?.id) === orderID ? { ...o, status: "delivered" } : o,
      ),
    );

    setUpdatingId(orderID);

    try {
      await axios.patch(
        `${API_BASE}/orders/${orderID}`,
        { status: "delivered" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (e) {
      console.error("ORDER_DELIVER_ERROR", e?.response?.data || e.message);
      setOrders(originalOrders);
      setErr(e?.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderID) => {
    const ok = window.confirm("Are you sure you want to delete this order?");
    if (!ok) return;

    setErr("");
    setDeletingId(orderID);

    const originalOrders = [...orders];
    setOrders((prev) => prev.filter((o) => (o?.orderID ?? o?.id) !== orderID));

    try {
      await axios.delete(`${API_BASE}/orders/${orderID}`, {
        withCredentials: true,
      });
    } catch (e) {
      console.error("ORDER_DELETE_ERROR", e?.response?.data || e.message);
      setOrders(originalOrders);
      setErr(e?.response?.data?.message || "Failed to delete order.");
    } finally {
      setDeletingId(null);
    }
  };

  const deleteAllOrders = async () => {
    if (!orders.length) return;

    const ok = window.confirm("Are you sure you want to delete ALL orders?");
    if (!ok) return;

    setErr("");
    setDeletingAll(true);

    const originalOrders = [...orders];
    setOrders([]);

    try {
      await axios.delete(`${API_BASE}/orders`, {
        withCredentials: true,
      });
    } catch (e) {
      console.error("DELETE_ALL_ORDERS_ERROR", e?.response?.data || e.message);
      setOrders(originalOrders);
      setErr(e?.response?.data?.message || "Failed to delete all orders.");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="orders-wrap">
      <div className="orders-head">
        <h2>Orders</h2>

        <div className="orders-actions">
          <input
            className="orders-search"
            placeholder="Search by order, customer, driver, status, currency…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="pill">{stats.total} total</span>
          <span className="pill pill-ok">{stats.deliveredCount} delivered</span>
          <span className="pill pill-warn">
            {stats.notDeliveredCount} not delivered
          </span>

          <button
            className="btn-delete-all"
            onClick={deleteAllOrders}
            disabled={deletingAll || orders.length === 0}
          >
            {deletingAll ? "Deleting..." : "Delete All"}
          </button>
        </div>
      </div>

      <div className="orders-summary">
        <div className="summary-card full-width">
          <div className="summary-title">Collected money by driver</div>
          <div className="summary-sub">
            Sum of totalPrice for delivered orders only, grouped by driver and
            currency
          </div>

          {stats.perDriverCurrency.length === 0 ? (
            <div className="small-note">No delivered orders yet.</div>
          ) : (
            <ul className="driver-sums">
              {stats.perDriverCurrency.map((item, idx) => (
                <li key={`${item.driverName}-${item.currency}-${idx}`}>
                  <span className="driver-name">
                    {item.driverName} ({item.currency})
                  </span>
                  <span className="driver-sum">
                    {item.total.toFixed(2)} {item.currency}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {loading && <div className="state note">Loading…</div>}
      {err && !loading && <div className="state error">{err}</div>}

      {!loading && !err && (
        <div className="orders-card">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Driver</th>
                <th>Order</th>
                <th>Address</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Delivery</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(filtered) && filtered.length > 0 ? (
                filtered.map((o) => {
                  const id = o?.orderID ?? o?.id;
                  const isDelivered = o?.status === "delivered";

                  const driverName =
                    `${o?.driver?.fName ?? ""} ${o?.driver?.lName ?? ""}`.trim() ||
                    `Driver #${o?.driverId ?? "-"}`;

                  return (
                    <tr
                      key={id}
                      className={isDelivered ? "row-delivered" : "row-pending"}
                    >
                      <td>#{id ?? "-"}</td>
                      <td>{driverName}</td>
                      <td>{o?.orderName ?? "-"}</td>
                      <td>{o?.orderAddress ?? "-"}</td>
                      <td>{o?.customerName ?? "-"}</td>
                      <td>{o?.customerPhone ?? "-"}</td>
                      <td>{money(o?.totalPrice, o?.currency)}</td>
                      <td>{money(o?.deliveryPrice, o?.currency)}</td>
                      <td>{(o?.currency || "-").toUpperCase()}</td>
                      <td>
                        <span
                          className={`badge ${isDelivered ? "delivered" : "pending"}`}
                        >
                          {o?.status ?? "-"}
                        </span>
                      </td>
                      <td>{safeDate(o?.created_at)}</td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className={`btn-deliver ${isDelivered ? "done" : ""}`}
                            onClick={() => markDelivered(id)}
                            disabled={isDelivered || updatingId === id}
                            title={
                              isDelivered
                                ? "Already delivered"
                                : "Mark as delivered"
                            }
                          >
                            {updatingId === id
                              ? "Saving..."
                              : isDelivered
                                ? "Delivered"
                                : "Mark Delivered"}
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() => deleteOrder(id)}
                            disabled={deletingId === id}
                          >
                            {deletingId === id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="12" className="empty">
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
};

export default Orders;
