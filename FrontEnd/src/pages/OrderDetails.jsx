import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../css/orderDetails.css";

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * نستقبل الـ Order من صفحة Orders
   * بدون الحاجة إلى طلب جديد من Laravel.
   */
  const order = location.state?.order;

  const money = (amount, currency) => {
    const number = Number(amount);

    if (!Number.isFinite(number)) {
      return "-";
    }

    return `${number.toFixed(2)} ${(currency || "").toUpperCase()}`.trim();
  };

  const safeDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString();
  };

  /*
   * إذا دخل المستخدم إلى صفحة التفاصيل
   * مباشرة بدون الضغط على Order من صفحة Orders.
   */
  if (!order) {
    return (
      <div className="order-details-page">
        <button
          className="order-back-button"
          onClick={() => navigate("/dashboard/orders")}
        >
          ← Back to Orders
        </button>

        <div className="order-details-state">
          Order information is not available.
        </div>
      </div>
    );
  }

  const driverName =
    `${order?.driver?.fName ?? ""} ${order?.driver?.lName ?? ""}`.trim() ||
    `Driver #${order?.driverId ?? "-"}`;

  const isDelivered = order?.status === "delivered";

  const orderID = order?.orderID ?? order?.id;

  return (
    <div className="order-details-page">
      <div className="order-details-header">
        <button
          className="order-back-button"
          onClick={() => navigate("/dashboard/orders")}
        >
          ← Back
        </button>

        <h2>Order Details</h2>
      </div>

      <div className="order-details-card">
        {/* Header */}
        <div className="order-details-title">
          <div>
            <span>Order</span>
            <h3>#{orderID ?? "-"}</h3>
          </div>

          <span
            className={`order-status ${isDelivered ? "delivered" : "pending"}`}
          >
            {order?.status ?? "-"}
          </span>
        </div>

        {/* Driver */}
        <div className="order-details-section">
          <h4>Driver Information</h4>

          <div className="order-info-row">
            <span>Driver Name</span>
            <strong>{driverName}</strong>
          </div>

          <div className="order-info-row">
            <span>Driver Phone</span>
            <strong>{order?.driver?.phone ?? "-"}</strong>
          </div>

          <div className="order-info-row">
            <span>Driver Email</span>
            <strong>{order?.driver?.email ?? "-"}</strong>
          </div>
        </div>

        {/* Order */}
        <div className="order-details-section">
          <h4>Order Information</h4>

          <div className="order-info-row">
            <span>Order Name</span>
            <strong>{order?.orderName ?? "-"}</strong>
          </div>

          <div className="order-info-row">
            <span>Order ID</span>
            <strong>#{orderID ?? "-"}</strong>
          </div>

          <div className="order-info-row">
            <span>Status</span>
            <strong>{order?.status ?? "-"}</strong>
          </div>

          <div className="order-info-row">
            <span>Created</span>
            <strong>{safeDate(order?.created_at)}</strong>
          </div>
        </div>

        {/* Customer */}
        <div className="order-details-section">
          <h4>Customer Information</h4>

          <div className="order-info-row">
            <span>Customer Name</span>
            <strong>{order?.customerName ?? "-"}</strong>
          </div>

          {/* <div className="order-info-row">
            <span>Customer Phone</span>
            <strong>{order?.customerPhone ?? "-"}</strong>
          </div> */}
          <div className="order-info-row">
            <span>Customer Phone</span>

            <strong>
              {order?.customerPhone ? (
                <>
                  <a href={`tel:${order.customerPhone}`}>
                    {order.customerPhone}
                  </a>

                  {" | "}

                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </>
              ) : (
                "-"
              )}
            </strong>
          </div>

          <div className="order-info-row">
            <span>Address</span>

            <strong>{order?.orderAddress ?? "-"}</strong>
          </div>
        </div>

        {/* Payment */}
        <div className="order-details-section">
          <h4>Payment Information</h4>

          <div className="order-info-row">
            <span>Total Price</span>

            <strong>{money(order?.totalPrice, order?.currency)}</strong>
          </div>

          <div className="order-info-row">
            <span>Delivery Price</span>

            <strong>{money(order?.deliveryPrice, order?.currency)}</strong>
          </div>

          <div className="order-info-row">
            <span>Currency</span>

            <strong>{(order?.currency || "-").toUpperCase()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
