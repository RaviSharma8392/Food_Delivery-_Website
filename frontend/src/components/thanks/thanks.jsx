import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHome, FaClock, FaListAlt } from "react-icons/fa";

const Thanks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.cart || [];

  const totalAmount = orderDetails.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-white py-6 px-6 border-b border-gray-100">
          <div className="flex justify-center text-green-500 mb-4">
            <FaCheckCircle size={52} className="drop-shadow-sm" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">
            Thank You!
          </h1>
          <p className="text-gray-500 text-center">
            Your order has been received
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Delivery Info */}
          <div className="flex items-center bg-blue-50 rounded-lg p-4 mb-6">
            <FaClock className="text-blue-500 text-xl mr-3" />
            <div>
              <h3 className="font-medium text-gray-800">Delivery Time</h3>
              <p className="text-gray-600">30-45 minutes</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <div className="flex items-center text-gray-700 mb-3">
              <FaListAlt className="mr-2" />
              <h3 className="font-semibold">Order Summary</h3>
            </div>
            <div className="space-y-3">
              {orderDetails.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {item.itemName}{" "}
                    <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">₹{totalAmount}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors shadow-md">
            <FaHome className="mr-2" />
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
