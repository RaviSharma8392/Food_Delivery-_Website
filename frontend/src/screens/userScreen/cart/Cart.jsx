import React, { useState } from "react";
import { useCartContext } from "../../../context/cartContext";
import { useNavigate } from "react-router-dom";
import useUserContext from "../../../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const { user } = useUserContext();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    delivery_fees,
    restaurantId,
    restaurantName,
  } = useCartContext();
  const navigate = useNavigate();

  const getTotalCartAmount = () => {
    return cart.reduce(
      (total, item) => total + item.quantity * item.item.price,
      0
    );
  };

  const handleQuantityChange = (id, portion, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, portion, newQuantity);
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);

  const subtotal = getTotalCartAmount();
  const total = subtotal + (subtotal > 0 ? delivery_fees : 0);
  const [showPopup, setShowPopup] = useState(false);

  const handleProceed = () => {
    if (subtotal < 299) {
      toast.error("Minimum order value is ₹299 to place order");
      return;
    }

    if (user) {
      navigate("/user/placeorder");
    } else {
      setShowPopup(true);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleContinueGuest = () => {
    navigate("/order");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-3 bg-orange-100 rounded-full mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
          {cart.length > 0 && (
            <p className="text-gray-600">
              From <span className="text-orange-500">{restaurantName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Empty Cart State */}
      {cart.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-40 h-40 mb-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.5 7.67001V6.70001C7.5 4.45001 9.31 2.24001 11.56 2.03001C14.24 1.77001 16.5 3.88001 16.5 6.51001V7.89001"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22H15C20 22 20.5 20 20.5 17V11C20.5 8 20 6 15 6H9C4 6 3.5 8 3.5 11V17C3.5 20 4 22 9 22Z"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.4955 12H15.5045"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.49451 12H8.50349"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't added any items to your cart yet
          </p>
          <button
            onClick={handleContinueShopping}
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition">
            Continue Shopping
          </button>
        </div>
      )}

      {/* Cart Items */}
      {cart.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
              {cart.map((cartItem) => (
                <div
                  key={`${cartItem.id}-${cartItem.portion}`}
                  className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800">
                        {cartItem.item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {cartItem.portion}
                      </p>
                      <p className="font-medium text-orange-600">
                        {formatPrice(cartItem.item.price)}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.id,
                                cartItem.portion,
                                cartItem.quantity - 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                            -
                          </button>
                          <span className="px-3 py-1">{cartItem.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.id,
                                cartItem.portion,
                                cartItem.quantity + 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(cartItem.id, cartItem.portion)
                          }
                          className="text-red-500 text-sm font-medium">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Item Total</span>
                    <span className="font-medium">
                      {formatPrice(cartItem.item.price * cartItem.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 font-medium">
                    <th className="p-4">Item</th>
                    <th className="p-4">Portion</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Total</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((cartItem) => (
                    <tr
                      key={`${cartItem.id}-${cartItem.portion}`}
                      className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 mr-4">
                            <img
                              src={cartItem.item.image}
                              alt={cartItem.item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <span className="font-medium">
                            {cartItem.item.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{cartItem.portion}</td>
                      <td className="p-4 font-medium">
                        {formatPrice(cartItem.item.price)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.id,
                                cartItem.portion,
                                cartItem.quantity - 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                            -
                          </button>
                          <span className="px-3 py-1">{cartItem.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.id,
                                cartItem.portion,
                                cartItem.quantity + 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        {formatPrice(cartItem.item.price * cartItem.quantity)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            removeFromCart(cartItem.id, cartItem.portion)
                          }
                          className="text-red-500 hover:text-red-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {subtotal === 0
                      ? formatPrice(0)
                      : formatPrice(delivery_fees)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg text-orange-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                disabled={subtotal === 0}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
                  subtotal === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}>
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-amber-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Continue Without Login?
            </h2>
            <p className="text-gray-600 mb-6">
              If you don't log in, you won't be able to view your order history
              or track orders.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full py-2.5 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition">
                Login for Full Benefits
              </button>
              <button
                onClick={handleContinueGuest}
                className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                Continue as Guest
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-2.5 px-4 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
