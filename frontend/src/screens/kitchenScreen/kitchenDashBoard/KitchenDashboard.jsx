import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  RefreshCw,
  Utensils,
  AlertCircle,
} from "lucide-react";

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  // Status configuration
  const statusConfig = {
    pending: {
      icon: <Clock className="w-4 h-4" />,
      color: "bg-amber-100 text-amber-800",
    },
    delivered: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: "bg-green-100 text-green-800",
    },
    cancelled: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: "bg-red-100 text-red-800",
    },
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/v1/kitchen/orders",
        {
          withCredentials: true,
        }
      );
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/kitchen/orders/${orderId}`,
        {
          status: newStatus.toLowerCase(),
        },
        {
          withCredentials: true,
        }
      );
      fetchOrders(); // Refresh after update
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  useEffect(() => {
    fetchOrders();

    // // Optional: Set up real-time updates with WebSocket or polling
    // const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    // return () => clearInterval(interval);
  }, []);

  // Filter orders based on active tab
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Utensils className="text-orange-500" /> Kitchen Dashboard
          </h1>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto mb-6 pb-2 gap-2">
          {["all", "pending", "delivered", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && filteredOrders.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : null}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
            <Package className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-700">
              {activeTab === "all" ? "No orders yet" : `No ${activeTab} orders`}
            </h3>
            <p className="mt-1 text-gray-500">
              {activeTab === "all"
                ? "New orders will appear here automatically"
                : "Check other status tabs for pending orders"}
            </p>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && filteredOrders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-700">
                      #{order._id.slice(-6)}
                    </span>
                    <span
                      className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        statusConfig[order.status]?.color || "bg-gray-100"
                      } flex items-center gap-1`}>
                      {statusConfig[order.status]?.icon || (
                        <Package className="w-4 h-4" />
                      )}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString([], {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="p-4 border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    CUSTOMER
                  </h4>
                  <p className="font-medium">
                    {order.user.name || order.userId?.name || "Guest"}
                  </p>
                  <p className="font-medium">
                    {order.user.phone || order.userId?.phone || "Guest"}
                  </p>
                  <p className="font-medium">{order.address}</p>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    ITEMS
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => {
                      // Handle both populated items and item references
                      const itemData = item.items || item;
                      const imageUrl =
                        itemData.image || "/food-placeholder.png";

                      return (
                        <div key={idx} className="flex gap-3">
                          <div className="w-12 h-12 flex-shrink-0 rounded-md bg-gray-100 border border-gray-200 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={itemData.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/food-placeholder.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {itemData.name}
                            </p>
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>
                                {item.portion && `${item.portion} • `}
                                {item.quantity}x
                              </span>
                              <span>
                                ₹
                                {(item.price || itemData.price) * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 font-bold text-orange-600">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="text-xs border border-gray-300 rounded-full px-3 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                        {Object.keys(statusConfig).map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDashboard;
