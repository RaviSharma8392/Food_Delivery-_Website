import React, { useState } from "react";
import axios from "axios";
import { useCartContext } from "../../../context/cartContext";
import { useNavigate } from "react-router-dom";
import {
  FiCreditCard,
  FiDollarSign,
  FiMapPin,
  FiShoppingCart,
  FiUser,
  FiPhone,
  FiCheck,
  FiX,
  FiTag,
} from "react-icons/fi";

// ✅ Custom Axios instance using env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_PUBLIC_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const PlaceOrder2 = () => {
  const navigate = useNavigate();
  const {
    cart,
    total_amount,
    delivery_fees,
    grand_total,
    clearCart,
    restaurantId,
    restaurantName,
  } = useCartContext();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");

  const promoCodes = {
    HUNGRY10: 10,
    FOODIE20: 20,
    DELISH30: 30,
    MEGA50: 50,
  };

  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }

    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);
      setAppliedPromo(code);
      setPromoError("");
      setPromoSuccess(`${promoCodes[code]}% discount applied!`);
      setTimeout(() => setPromoSuccess(""), 3000);
    } else {
      setDiscount(0);
      setAppliedPromo("");
      setPromoError("Invalid promo code");
      setPromoSuccess("");
    }
  };

  const removePromoCode = () => {
    setDiscount(0);
    setPromoCode("");
    setAppliedPromo("");
    setPromoError("");
    setPromoSuccess("");
  };

  const discountAmount = (grand_total * discount) / 100;
  const finalTotal = grand_total - discountAmount;

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (cart.length === 0) {
      setError("Your cart is empty!");
      setIsLoading(false);
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all the delivery details");
      setIsLoading(false);
      return;
    }

    const orderData = {
      name,
      phone,
      address,
      method: paymentMethod,
      subtotal: total_amount,
      deliveryFee: delivery_fees,
      totalAmount: finalTotal,
      discountPercentage: discount,
      discountAmount,
      promoCode: appliedPromo,
      restaurantId,
      items: cart.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
        portion: item.portion,
      })),
    };

    try {
      const res = await api.post("/public/placeorder", orderData);
      if (res.status === 201) {
        clearCart();
        alert("✅ Order placed successfully!");
        navigate("/thanks");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while placing your order"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatINR = (value) =>
    value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    });

  return (
    <div className="max-w-6xl mt-5 mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="p-3 bg-orange-100 rounded-full mr-4">
          <FiShoppingCart className="text-orange-500 text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600">Review your order details</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Delivery Info - Left Column */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <FiMapPin className="text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold">Delivery Information</h2>
            </div>

            <form onSubmit={handleOrderSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-medium mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 font-medium mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full delivery address with landmarks"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-full mr-3">
                        <FiCreditCard className="text-purple-500" />
                      </div>
                      <span>Payment Method</span>
                    </div>
                  </label>

                  <div className="space-y-3">
                    <div
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === "cash"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("cash")}>
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <FiDollarSign className="text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Cash on Delivery</h3>
                          <p className="text-sm text-gray-500">
                            Pay when you receive your order
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "cash" && (
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <FiCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === "online"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("online")}>
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                          <FiCreditCard className="text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Online Payment</h3>
                          <p className="text-sm text-gray-500">
                            Pay securely with UPI, cards or wallets
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "online" && (
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <FiCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary - Right Column */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-orange-100 rounded-full mr-3">
                <FiShoppingCart className="text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>

            {/* Restaurant Name */}
            {cart.length > 0 && (
              <div className="mb-4 pb-4 border-b">
                <h3 className="font-medium text-gray-800">
                  Restaurant:{" "}
                  <span className="text-orange-600">{restaurantName}</span>
                </h3>
              </div>
            )}

            {/* Cart Items */}
            <div className="mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.portion}`}
                  className="flex justify-between py-3 border-b">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.item.name}{" "}
                      <span className="text-gray-500">({item.portion})</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatINR(item.item.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatINR(item.item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="mb-4">
              <label
                htmlFor="promoCode"
                className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center">
                  <FiTag className="mr-2 text-orange-500" />
                  Apply Promo Code
                </div>
              </label>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <span className="font-medium text-green-700">
                      {appliedPromo}
                    </span>
                    <span className="ml-2 text-sm text-green-600">
                      {discount}% off applied
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-gray-500 hover:text-gray-700">
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <input
                    type="text"
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-orange-500 text-white font-medium rounded-r-lg hover:bg-orange-600 transition">
                    Apply
                  </button>
                </div>
              )}

              {promoError && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <FiX className="mr-1" /> {promoError}
                </p>
              )}

              {promoSuccess && (
                <div className="mt-2 p-2 bg-green-100 text-green-700 rounded-lg text-sm flex items-center">
                  <FiCheck className="mr-2" /> {promoSuccess}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="mb-6">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatINR(total_amount)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">{formatINR(delivery_fees)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount ({discount}%)</span>
                  <span className="text-green-500 font-medium">
                    -{formatINR(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-3 border-t border-b mt-2">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-lg text-orange-600">
                  {formatINR(finalTotal)}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleOrderSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
                isLoading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Place Order (${formatINR(finalTotal)})`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder2;
