import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Clock,
  CheckCircle,
  Truck,
  RefreshCw,
  ChefHat,
  AlertCircle,
} from "lucide-react";

// Set base URL using Vite's environment variable
axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
axios.defaults.withCredentials = true;

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const statusConfig = {
    pending: {
      icon: <Clock className="w-4 h-4" />,
      color: "bg-amber-100 text-amber-800",
      borderColor: "border-amber-300",
      label: "Pending",
      actions: ["preparing", "cancelled"],
    },
    preparing: {
      icon: <ChefHat className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-800",
      borderColor: "border-blue-300",
      label: "Preparing",
      actions: ["ready_for_delivery"],
    },
    ready_for_delivery: {
      icon: <Truck className="w-4 h-4" />,
      color: "bg-purple-100 text-purple-800",
      borderColor: "border-purple-300",
      label: "Ready",
      actions: ["delivered"],
    },
    delivered: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: "bg-green-100 text-green-800",
      borderColor: "border-green-300",
      label: "Delivered",
    },
    cancelled: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: "bg-red-100 text-red-800",
      borderColor: "border-red-300",
      label: "Cancelled",
    },
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/kitchen/orders");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(`/kitchen/orders/${orderId}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-500 text-sm">
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1 ? "order" : "orders"} found
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {["all", ...Object.keys(statusConfig)].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-orange-500 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}>
            {tab === "all" ? (
              "All Orders"
            ) : (
              <span className="flex items-center gap-1">
                {statusConfig[tab]?.icon}
                {statusConfig[tab]?.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">Loading orders...</div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-2">No orders found</div>
          <button
            onClick={fetchOrders}
            className="text-orange-500 hover:text-orange-600 text-sm font-medium">
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const deliveryFee = order.deliveryFee || 50;
            const subtotal = order.totalAmount - deliveryFee;
            const status = statusConfig[order.status];

            return (
              <div
                key={order._id}
                className={`bg-white rounded-xl border ${
                  status?.borderColor || "border-gray-200"
                } p-5 shadow-sm hover:shadow-md transition-shadow`}>
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${status?.color} flex items-center gap-1`}>
                        {status?.icon}
                        {status?.label}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Order Details */}
                <div className="text-xs text-gray-500 mb-4">
                  Ordered at: {new Date(order.createdAt).toLocaleString()}
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="text-sm text-gray-700 mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Fee:</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2 mt-1">
                    <span>Total:</span>
                    <span className="text-orange-600">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Status Actions */}
                {status?.actions && (
                  <div className="mt-5">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all">
                      <option value={order.status}>
                        Current: {status.label}
                      </option>
                      {status.actions.map((action) => (
                        <option key={action} value={action}>
                          Mark as {statusConfig[action]?.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
