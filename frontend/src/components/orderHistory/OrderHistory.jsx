import React, { useEffect, useState } from "react";
import useUserContext from "../../context/UserContext";
import {
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OrderHistory() {
  const { user, loading } = useUserContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "processing", label: "Processing" },
  ];

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/user/myOrders/${user.user._id}`
      );
      const data = await response.json();

      if (data.success) {
        // Sort orders by date (newest first)
        const sortedOrders = data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
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

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(
          (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
        )
      );
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [statusFilter, orders]);

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

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-50 mt-10 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
            <FiFilter className="mr-1" />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-white rounded-lg shadow-xs p-4 mb-4">
            <h3 className="font-medium text-gray-800 mb-3">Filter by Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    statusFilter === option.value
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
          <>
            <div className="space-y-4 mb-6">
              {currentOrders.map((order) => (
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
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
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
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredOrders.length > ordersPerPage && (
              <div className="flex justify-center items-center mt-6">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full mr-2 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  <FiChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-full mx-1 ${
                        currentPage === number
                          ? "bg-gray-800 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}>
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ml-2 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Order Count */}
            <div className="text-center text-sm text-gray-500 mt-4">
              Showing {indexOfFirstOrder + 1}-
              {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </div>
          </>
        )}
      </div>
    </div>
  );
}
