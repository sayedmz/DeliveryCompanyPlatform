import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/orders.css";

const API_BASE = "http://localhost:8000/api";

const STATUS_OPTIONS = ["pending", "in_progress", "delivered", "cancelled"];

const Orders = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const isAdmin = user?.role === "admin";

  // =========================================================
  // GET ORDERS
  // =========================================================

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

  // =========================================================
  // HELPERS
  // =========================================================

  const safeDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    return isNaN(date.getTime()) ? "-" : date.toLocaleString();
  };

  const safeNum = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  };

  const money = (amount, currency) => {
    const number = safeNum(amount);
    const currentCurrency = (currency || "").toUpperCase();

    return `${number.toFixed(2)} ${currentCurrency || ""}`.trim();
  };

  const getDriverName = (order) => {
    return (
      `${order?.driver?.fName ?? ""} ${order?.driver?.lName ?? ""}`.trim() ||
      `Driver #${order?.driverId ?? "-"}`
    );
  };

  // =========================================================
  // FILTER ORDERS
  // =========================================================

  const filtered = useMemo(() => {
    let base = Array.isArray(orders) ? orders : [];

    if (!user) {
      return [];
    }

    // Driver/User sees only his own orders
    if (user.role !== "admin") {
      const currentUserId = user.id ?? user.userID;

      base = base.filter((order) => {
        const orderDriverId =
          order?.driverId ??
          order?.driver_id ??
          order?.driver?.id ??
          order?.driver?.userID;

        return String(orderDriverId) === String(currentUserId);
      });
    }

    if (!q.trim()) {
      return base;
    }

    const searchValue = q.toLowerCase();

    return base.filter((order) => {
      const driverName = getDriverName(order);

      return (
        String(order?.orderID ?? order?.id ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        (order?.orderName &&
          order.orderName.toLowerCase().includes(searchValue)) ||
        (order?.orderAddress &&
          order.orderAddress.toLowerCase().includes(searchValue)) ||
        (order?.customerName &&
          order.customerName.toLowerCase().includes(searchValue)) ||
        (order?.customerPhone &&
          String(order.customerPhone).includes(searchValue)) ||
        (driverName && driverName.toLowerCase().includes(searchValue)) ||
        (order?.status &&
          String(order.status).toLowerCase().includes(searchValue)) ||
        (order?.currency &&
          String(order.currency).toLowerCase().includes(searchValue))
      );
    });
  }, [orders, q, user]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const stats = useMemo(() => {
    const list = Array.isArray(filtered) ? filtered : [];

    const delivered = list.filter((order) => order?.status === "delivered");

    const notDelivered = list.filter((order) => order?.status !== "delivered");

    const perDriverCurrency = new Map();

    delivered.forEach((order) => {
      const driverName = getDriverName(order);

      const currency = (order?.currency || "unknown").toUpperCase();

      const key = `${driverName}__${currency}`;

      const previousValue = perDriverCurrency.get(key) || {
        driverName,
        currency,
        total: 0,
      };

      previousValue.total += safeNum(order?.totalPrice);

      perDriverCurrency.set(key, previousValue);
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

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const updateOrderStatus = async (orderID, newStatus) => {
    if (!orderID || !STATUS_OPTIONS.includes(newStatus)) {
      return;
    }

    const originalOrders = [...orders];

    setErr("");
    setUpdatingId(orderID);

    // Optimistic update
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        (order?.orderID ?? order?.id) === orderID
          ? {
              ...order,
              status: newStatus,
            }
          : order,
      ),
    );

    try {
      const response = await axios.patch(
        `${API_BASE}/orders/${orderID}`,
        {
          status: newStatus,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // If Laravel returns the updated order,
      // use it to keep frontend data synchronized.
      if (response?.data?.order) {
        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            (order?.orderID ?? order?.id) === orderID
              ? response.data.order
              : order,
          ),
        );
      }
    } catch (e) {
      console.error(
        "ORDER_STATUS_UPDATE_ERROR",
        e?.response?.data || e.message,
      );

      // Restore previous orders if request fails
      setOrders(originalOrders);

      setErr(e?.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // DELETE ONE ORDER
  // ADMIN ONLY
  // =========================================================

  const deleteOrder = async (orderID) => {
    if (!isAdmin) {
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this order?");

    if (!ok) return;

    setErr("");
    setDeletingId(orderID);

    const originalOrders = [...orders];

    // Optimistic delete
    setOrders((previousOrders) =>
      previousOrders.filter(
        (order) => (order?.orderID ?? order?.id) !== orderID,
      ),
    );

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

  // =========================================================
  // DELETE ALL ORDERS
  // ADMIN ONLY
  // =========================================================

  const deleteAllOrders = async () => {
    if (!isAdmin || !orders.length) {
      return;
    }

    const ok = window.confirm("Are you sure you want to delete ALL orders?");

    if (!ok) return;

    setErr("");
    setDeletingAll(true);

    const originalOrders = [...orders];

    // Optimistic delete
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

  // =========================================================
  // STATUS SELECT
  // =========================================================

  const handleStatusChange = (event, orderID) => {
    const newStatus = event.target.value;

    updateOrderStatus(orderID, newStatus);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="orders-wrap">
      {/* =====================================================
          HEADER
      ====================================================== */}

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

          {/* Delete All is ADMIN ONLY */}
          {isAdmin && (
            <button
              className="btn-delete-all"
              onClick={deleteAllOrders}
              disabled={deletingAll || orders.length === 0}
            >
              {deletingAll ? "Deleting..." : "Delete All"}
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

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
              {stats.perDriverCurrency.map((item, index) => (
                <li key={`${item.driverName}-${item.currency}-${index}`}>
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

      {/* =====================================================
          STATES
      ====================================================== */}

      {loading && <div className="state note">Loading…</div>}

      {err && !loading && <div className="state error">{err}</div>}

      {!loading && !err && (
        <>
          {/* =================================================
              MOBILE
          ================================================== */}

          <div className="mobile-orders-list">
            {Array.isArray(filtered) && filtered.length > 0 ? (
              filtered.map((order) => {
                const id = order?.orderID ?? order?.id;

                const driverName = getDriverName(order);

                const orderName = order?.orderName ?? "Unnamed Order";

                const currentStatus = STATUS_OPTIONS.includes(order?.status)
                  ? order.status
                  : "pending";

                return (
                  <div
                    key={id}
                    className={`mobile-order-item status-${currentStatus}`}
                  >
                    {/* Clickable Order Content */}
                    <button
                      className="mobile-order-main"
                      onClick={() =>
                        navigate(`/dashboard/orders/${id}`, {
                          state: {
                            order,
                          },
                        })
                      }
                    >
                      <div className="mobile-order-content">
                        <span className="mobile-driver-name">
                          Driver Name: {driverName}
                        </span>

                        <span className="mobile-order-name">
                          Customer Name: {order?.customerName ?? "-"}
                        </span>

                        <span className="mobile-order-name">
                          Order Name: {orderName}
                        </span>
                      </div>

                      <span className="mobile-order-arrow">→</span>
                    </button>

                    {/* Status + Delete */}
                    <div className="mobile-order-actions">
                      <div className="mobile-status-wrapper">
                        <span className="mobile-status-label">Status</span>

                        <select
                          className="status-select"
                          value={currentStatus}
                          onChange={(event) => handleStatusChange(event, id)}
                          disabled={updatingId === id}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Delete ONLY for ADMIN */}
                      {isAdmin && (
                        <button
                          className="btn-delete"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteOrder(id);
                          }}
                          disabled={deletingId === id}
                        >
                          {deletingId === id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="mobile-orders-empty">No results</div>
            )}
          </div>

          {/* =================================================
              DESKTOP TABLE
          ================================================== */}

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
                  filtered.map((order) => {
                    const id = order?.orderID ?? order?.id;

                    const driverName = getDriverName(order);

                    const currentStatus = STATUS_OPTIONS.includes(order?.status)
                      ? order.status
                      : "pending";

                    return (
                      <tr key={id} className={`row-${currentStatus}`}>
                        <td>#{id ?? "-"}</td>

                        <td>{driverName}</td>

                        <td>{order?.orderName ?? "-"}</td>

                        <td>{order?.orderAddress ?? "-"}</td>

                        <td>{order?.customerName ?? "-"}</td>

                        <td>{order?.customerPhone ?? "-"}</td>

                        <td>{money(order?.totalPrice, order?.currency)}</td>

                        <td>{money(order?.deliveryPrice, order?.currency)}</td>

                        <td>{(order?.currency || "-").toUpperCase()}</td>

                        {/* STATUS SELECT */}
                        <td>
                          <select
                            className="status-select"
                            value={currentStatus}
                            onChange={(event) => handleStatusChange(event, id)}
                            disabled={updatingId === id}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>{safeDate(order?.created_at)}</td>

                        <td>
                          <div className="actions-cell">
                            {/* Delete ONLY for ADMIN */}
                            {isAdmin && (
                              <button
                                className="btn-delete"
                                onClick={() => deleteOrder(id)}
                                disabled={deletingId === id}
                              >
                                {deletingId === id ? "Deleting..." : "Delete"}
                              </button>
                            )}
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
        </>
      )}
    </div>
  );
};

export default Orders;
