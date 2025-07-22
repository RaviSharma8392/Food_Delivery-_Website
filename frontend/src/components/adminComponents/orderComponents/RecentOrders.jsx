import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiInfo,
} from "react-icons/fi";

const RecentOrders = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      console.log("hi restro");
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/admin/orders/recent", // No leading space
          {
            params: { limit: 10 },
          }
        );

        console.log(response);
        setRecentOrders(response.data);
      } catch (err) {
        console.error("Error fetching recent orders:", err);
        setError("Failed to load recent orders");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        ` http://localhost:3000/api/v1/admin/orders/${orderId}/status`,
        {
          status: newStatus,
        }
      );
      setRecentOrders(
        recentOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "preparing":
        return <FiClock className="text-blue-500" />;
      case "out_for_delivery":
        return <FiTruck className="text-purple-500" />;
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return <div className="text-center py-4">Loading recent orders...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {recentOrders.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No recent orders found
          </div>
        ) : (
          recentOrders.map((order) => (
            <div
              key={order._id}
              className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      #{order.orderId || order._id.slice(-6)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        order.status
                      )}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {order.userId?.name || order.name} •{" "}
                    {order.restaurantId?.name || "Restaurant"}
                  </div>
                  <div className="text-sm mt-1">
                    ₹{order.totalAmount} •{" "}
                    {format(new Date(order.createdAt), "MMM d, h:mm a")}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {getStatusIcon(order.status)}
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "preparing")}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                      Accept
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order._id, "out_for_delivery")
                      }
                      className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600">
                      Ready
                    </button>
                  )}
                  {order.status === "out_for_delivery" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "delivered")}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                      Complete
                    </button>
                  )}
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <div className="font-medium">Items:</div>
                  <ul className="list-disc list-inside">
                    {order.items.slice(0, 2).map((item) => (
                      <li key={item._id}>
                        {item.quantity}x {item.itemId?.name || "Item"} (
                        {item.portion})
                      </li>
                    ))}
                    {order.items.length > 2 && (
                      <li>+{order.items.length - 2} more items</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {recentOrders.length > 0 && (
        <div className="p-4 border-t border-gray-200 text-center">
          <a
            href="/admin/orders"
            className="text-sm text-blue-600 hover:underline">
            View all orders
          </a>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
