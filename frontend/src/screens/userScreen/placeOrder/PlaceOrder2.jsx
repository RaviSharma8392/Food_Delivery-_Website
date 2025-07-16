import React, { useState } from "react";
import axios from "axios";
import { useCartContext } from "../../../context/cartContext";
import useUserContext from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  FiCreditCard,
  FiDollarSign,
  FiMapPin,
  FiShoppingCart,
} from "react-icons/fi";
import "./PlaceOrder2.css";

const PlaceOrder2 = () => {
  const navigate = useNavigate();
  const { cart, total_amount, delivery_fees, grand_total, clearCart } =
    useCartContext();
  const { user } = useUserContext();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = user?.token;

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
      totalAmount: grand_total,
      items: cart.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
        portion: item.portion,
      })),
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/placeorder",
        orderData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.status === 201) {
        clearCart();
        alert("✅ Order placed successfully!");
        navigate("/thanks");
      }
    } catch (err) {
      console.error("Order error:", err);
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
    <div className="place-order-container">
      <div className="place-order-header">
        <h1>
          <FiShoppingCart /> Checkout
        </h1>
        <p>Review your order details</p>
      </div>

      <div className="place-order-grid">
        {/* Delivery Info Section */}
        <div className="delivery-details">
          <div className="section-header">
            <FiMapPin className="icon" />
            <h2>Delivery Information</h2>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Mobile Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full delivery address with landmarks"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="payment">
              <FiCreditCard className="icon" /> Payment Method
            </label>
            <div className="payment-options">
              <label
                className={`payment-option ${
                  paymentMethod === "cash" ? "active" : ""
                }`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                <FiDollarSign /> Cash on Delivery
              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "online" ? "active" : ""
                }`}>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <FiCreditCard /> Online Payment
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary">
          <div className="section-header">
            <FiShoppingCart className="icon" />
            <h2>Order Summary</h2>
          </div>

          <div className="order-items">
            {cart.map((item) => (
              <div key={`${item.id}-${item.portion}`} className="order-item">
                <div className="item-info">
                  <span className="item-name">
                    {item.item.name} ({item.portion})
                  </span>
                </div>
                <div className="item-price">
                  {item.quantity} × ₹{item.item.price} = ₹
                  {item.quantity * item.item.price}
                </div>
              </div>
            ))}
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>{formatINR(total_amount)}</span>
            </div>
            <div className="price-row">
              <span>Delivery Fee</span>
              <span>{formatINR(delivery_fees)}</span>
            </div>
            <div className="price-row total">
              <strong>Total Amount</strong>
              <strong>{formatINR(grand_total)}</strong>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="button"
            onClick={handleOrderSubmit}
            className="place-order-btn"
            disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              `Place Order (${formatINR(grand_total)})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder2;
