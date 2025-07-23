import React, { useState } from "react";
import { useCartContext } from "../../../context/cartContext";
import useUserContext from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiCreditCard,
  FiDollarSign,
  FiMapPin,
  FiShoppingCart,
  FiChevronRight,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { publicAPI } from "../../../api/index";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrder = ({ simpleMode = false }) => {
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
  const { user } = useUserContext();
  const { token } = user;

  const [address, setAddress] = useState(user.address || "");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [showPromoSuccess, setShowPromoSuccess] = useState(false);

  const promoCodes = {
    SAVE10: 10,
    SAVE20: 20,
    FOODIE30: 30,
    EATWELL40: 40,
    MEGA50: 50,
  };

  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);
      setPromoError("");
      setShowPromoSuccess(true);
      setTimeout(() => setShowPromoSuccess(false), 3000);
    } else {
      setDiscount(0);
      setPromoError("Invalid promo code");
    }
  };

  const discountAmount = (grand_total * discount) / 100;
  const discountedTotal = grand_total - discountAmount;

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (cart.length === 0) {
      setError("Your cart is empty!");
      setIsLoading(false);
      return;
    }

    if (!simpleMode && !address.trim()) {
      setError("Please enter a delivery address");
      setIsLoading(false);
      return;
    }

    const orderData = {
      userId: user.user._id,
      address: simpleMode ? "N/A" : address,
      method: simpleMode ? "cash" : paymentMethod,
      subtotal: total_amount,
      deliveryFee: delivery_fees,
      totalAmount: simpleMode ? grand_total : discountedTotal,
      promoCode: simpleMode ? null : promoCode.toUpperCase(),
      discountPercentage: simpleMode ? 0 : discount,
      discountAmount: simpleMode ? 0 : discountAmount,
      restaurantId,
      items: cart.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
        portion: item.portion,
      })),
    };

    try {
      const res = await publicAPI.placeOrder(orderData, token);
      // console.log(res.success);
      // clearCart();

      if (res.message === "Order placed successfully!") {
        console.log("orderplaced");
        toast.success("✅ Order placed successfully!", {
          autoClose: 2000,
          onClose: () => {
            const summaryCart = cart.map((item) => ({
              name: item.item.name,
              quantity: item.quantity,
              price: item.item.price,
              portion: item.portion,
            }));

            clearCart();

            navigate("/thanks", {
              state: {
                cart: summaryCart,
                total: orderData.totalAmount,
                address: orderData.address,
              },
            });
          },
        });

        clearCart();
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error(
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
    <div className="max-w-6xl mt-6 mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-orange-100 rounded-full mr-4">
          <FiShoppingCart className="text-orange-500 text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600">Review your order details</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {!simpleMode && (
              <>
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <FiMapPin className="text-blue-500" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    Delivery Information
                  </h2>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="4"
                    placeholder="Enter delivery address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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
                    {["cash", "online"].map((method) => (
                      <div
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                          paymentMethod === method
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}>
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full mr-3 ${
                              method === "cash" ? "bg-green-100" : "bg-blue-100"
                            }`}>
                            {method === "cash" ? (
                              <FiDollarSign className="text-green-500" />
                            ) : (
                              <FiCreditCard className="text-blue-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium capitalize">{method}</h3>
                            <p className="text-sm text-gray-500">
                              {method === "cash"
                                ? "Pay when you receive your order"
                                : "Pay securely with UPI, cards or wallets"}
                            </p>
                          </div>
                        </div>
                        {paymentMethod === method && (
                          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                            <FiCheck className="text-white text-xs" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiShoppingCart className="mr-2 text-orange-500" />
              Order Summary
            </h2>

            {restaurantName && (
              <p className="text-gray-800 mb-3">
                Restaurant:{" "}
                <span className="text-orange-600">{restaurantName}</span>
              </p>
            )}

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

            {!simpleMode && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Apply Promo Code
                </label>
                <div className="flex">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. SAVE10"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-orange-500 text-white font-medium rounded-r-lg hover:bg-orange-600">
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <FiX className="mr-1" /> {promoError}
                  </p>
                )}
                {showPromoSuccess && (
                  <div className="mt-2 p-2 bg-green-100 text-green-700 rounded-lg text-sm flex items-center">
                    <FiCheck className="mr-2" />
                    {discount}% discount applied! You saved{" "}
                    {formatINR(discountAmount)}.
                  </div>
                )}
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatINR(total_amount)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">{formatINR(delivery_fees)}</span>
              </div>
              {!simpleMode && discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">
                    -{formatINR(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t mt-2">
                <strong>Total</strong>
                <strong className="text-orange-600">
                  {formatINR(simpleMode ? grand_total : discountedTotal)}
                </strong>
              </div>
            </div>

            <button
              onClick={handleOrderSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
                isLoading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}>
              {isLoading
                ? "Placing Order..."
                : `Place Order (${formatINR(
                    simpleMode ? grand_total : discountedTotal
                  )})`}
            </button>
            {error && (
              <p className="mt-4 text-red-600 font-medium text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
