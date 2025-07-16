import React, { useEffect, useState } from "react";
import useUserContext from "../../context/UserContext";
import "./orderHistory.css";

export default function OrderHistory() {
  const { user, loading } = useUserContext();
  const [orders, setOrders] = useState([]);

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/user/myOrders/${user.user._id}`
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  useEffect(() => {
    if (!loading && user?.user?._id) {
      fetchOrderHistory();
    }
  }, [loading, user]);

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">📜 Your Order History</h2>

      {orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        orders.map((order, orderIndex) => (
          <div key={order.orderId} className="order-card">
            <div className="order-header">
              <p>
                <strong>Order ID:</strong> {order.orderId}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </div>

            <table className="order-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Portion</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.portion}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>₹{item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="order-summary">
              <p>
                <strong>Subtotal (Items):</strong> ₹{order.subtotal.toFixed(2)}
              </p>
              <p>
                <strong>Delivery Fee:</strong> ₹{order.deliveryFee.toFixed(2)}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
