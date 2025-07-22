import React, { useEffect, useState } from "react";
import useUserContext from "../../context/UserContext";
import { FiClock, FiCheckCircle, FiTruck, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const { user, loading } = useUserContext();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <FiCheckCircle className="text-green-500 mr-2" />;
      case "cancelled":
        return <FiXCircle className="text-red-500 mr-2" />;
      default:
        return <FiTruck className="text-orange-500 mr-2" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Your Orders</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-xs p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiClock className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-xs overflow-hidden">
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        {getStatusIcon(order.status)}
                        <span className="font-medium">{order.status}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Order #{order.orderId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">
                    {order.restaurant?.name || "Restaurant"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.restaurant?.address || ""}
                  </p>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between mb-3 last:mb-0">
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          {item.portion && (
                            <p className="text-xs text-gray-500">
                              {item.portion}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-800">
                        ₹{item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500 mt-2">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Item Total</span>
                    <span className="text-gray-800">
                      ₹{order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-800">
                      ₹{order.deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium mt-2">
                    <span className="text-gray-800">Grand Total</span>
                    <span className="text-orange-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="p-4 border-t border-gray-100 flex justify-between">
                  <button className="text-orange-500 text-sm font-medium">
                    Reorder
                  </button>
                  <button className="text-gray-600 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
