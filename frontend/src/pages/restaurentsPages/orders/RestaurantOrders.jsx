import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMotorcycle,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./RestaurantOrders.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(BASE_URL);
console.log("why are you calling me");
const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  const statusConfig = {
    pending: {
      icon: <FaClock className="text-amber-500" />,
      label: "Pending",
      color: "bg-amber-100 text-amber-800",
      actions: ["accepted", "rejected"],
    },
    accepted: {
      icon: <FaMotorcycle className="text-blue-500" />,
      label: "Preparing",
      color: "bg-blue-100 text-blue-800",
      actions: ["ready", "cancelled"],
    },
    ready: {
      icon: <FaMotorcycle className="text-purple-500" />,
      label: "Ready for Delivery",
      color: "bg-purple-100 text-purple-800",
      actions: ["out_for_delivery"],
    },
    out_for_delivery: {
      icon: <FaMotorcycle className="text-indigo-500" />,
      label: "On the Way",
      color: "bg-indigo-100 text-indigo-800",
      actions: ["delivered"],
    },
    delivered: {
      icon: <FaCheckCircle className="text-green-500" />,
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    rejected: {
      icon: <FaTimesCircle className="text-red-500" />,
      label: "Rejected",
      color: "bg-red-100 text-red-800",
    },
    cancelled: {
      icon: <FaTimesCircle className="text-red-500" />,
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  };
  console.log("hi admin");
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/v1/public/orders`, {
        withCredentials: true,
      });

      console.log("hi here is admin data" + data);
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/v1/restaurant/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Order updated to ${statusConfig[newStatus]?.label}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesArea =
      areaFilter === "all" ||
      (order.address &&
        order.address.toLowerCase().includes(areaFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesArea;
  });

  const deliveryAreas = [
    ...new Set(
      orders
        .map((order) => order.address?.split(",")[1]?.trim())
        .filter(Boolean)
    ),
  ];

  return (
    <div className="restaurant-orders-container">
      <div className="orders-header">
        <h2>Order Management</h2>
        <div className="controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label>
                <FaFilter /> Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                {Object.keys(statusConfig).map((status) => (
                  <option key={status} value={status}>
                    {statusConfig[status].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>
                <FaMapMarkerAlt /> Area:
              </label>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}>
                <option value="all">All Areas</option>
                {deliveryAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders">No orders found</div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">#{order._id.slice(-6)}</div>
                <div
                  className={`status-badge ${
                    statusConfig[order.status]?.color
                  }`}>
                  {statusConfig[order.status]?.icon}
                  {statusConfig[order.status]?.label}
                </div>
              </div>

              <div className="order-details">
                <div className="detail-group">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span className="delivery-area">
                    {order.address || "N/A"}
                  </span>
                </div>

                <div className="detail-group">
                  <span className="detail-label">Time:</span>
                  <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="detail-group">
                  <span className="detail-label">Items:</span>
                  <span>{order.items.length}</span>
                </div>

                <div className="detail-group">
                  <span className="detail-label">Total:</span>
                  <span className="order-total">₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">
                      {item.itemId?.name || "Unknown Item"} ({item.portion})
                    </span>
                    <span className="item-price">
                      ₹
                      {item.itemId?.price
                        ? item.itemId.price * item.quantity
                        : 0}
                    </span>
                  </div>
                ))}
              </div>

              {statusConfig[order.status]?.actions && (
                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className="status-select">
                    <option value={order.status}>Change status...</option>
                    {statusConfig[order.status].actions.map((action) => (
                      <option key={action} value={action}>
                        Mark as {statusConfig[action].label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
