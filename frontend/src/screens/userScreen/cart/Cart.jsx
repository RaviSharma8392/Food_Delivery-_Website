import React, { useState } from "react";
import "./Cart.css";
import { useCartContext } from "../../../context/cartContext";
import { useNavigate } from "react-router-dom";
import useUserContext from "../../../context/UserContext";

const Cart = () => {
  const { user } = useUserContext();
  const { cart, removeFromCart, updateQuantity, delivery_fees } =
    useCartContext();

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
    }).format(value);

  const subtotal = getTotalCartAmount();
  const total = subtotal + (subtotal > 0 ? delivery_fees : 0);
  const [showPopup, setShowPopup] = useState(false);

  const handleProceed = () => {
    if (subtotal === 0) return;

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

  return (
    <div className="cart">
      <h1 className="cart-title">Your Cart</h1>

      {/* Mobile View */}
      <div className="mobile-cart-items">
        {cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty</p>
        ) : (
          cart.map((cartItem) => (
            <div
              key={`${cartItem.id}-${cartItem.portion}`}
              className="mobile-cart-item">
              <div className="mobile-cart-item-header">
                <img src={cartItem.item.image} alt={cartItem.item.name} />
                <div>
                  <h3>
                    {cartItem.item.name} ({cartItem.portion})
                  </h3>
                  <p>{formatPrice(cartItem.item.price)}</p>
                </div>
              </div>

              <div className="mobile-cart-item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        cartItem.id,
                        cartItem.portion,
                        cartItem.quantity - 1
                      )
                    }>
                    -
                  </button>
                  <span>{cartItem.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        cartItem.id,
                        cartItem.portion,
                        cartItem.quantity + 1
                      )
                    }>
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(cartItem.id, cartItem.portion)}
                  className="remove-btn">
                  Remove
                </button>
              </div>

              <div className="mobile-cart-item-total">
                <span>
                  Total: {formatPrice(cartItem.item.price * cartItem.quantity)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="desktop-cart-items">
        {cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items-title">
              <p>Image</p>
              <p>Title</p>
              <p>Portion</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <hr />

            {cart.map((cartItem) => (
              <div key={`${cartItem.id}-${cartItem.portion}`}>
                <div className="cart-items-item">
                  <img src={cartItem.item.image} alt={cartItem.item.name} />
                  <p>{cartItem.item.name}</p>
                  <p>{cartItem.portion}</p>
                  <p>{formatPrice(cartItem.item.price)}</p>
                  <div className="desktop-quantity-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          cartItem.id,
                          cartItem.portion,
                          cartItem.quantity - 1
                        )
                      }>
                      -
                    </button>
                    <span>{cartItem.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          cartItem.id,
                          cartItem.portion,
                          cartItem.quantity + 1
                        )
                      }>
                      +
                    </button>
                  </div>
                  <p>{formatPrice(cartItem.item.price * cartItem.quantity)}</p>
                  <button
                    onClick={() =>
                      removeFromCart(cartItem.id, cartItem.portion)
                    }
                    className="remove-btn">
                    Remove
                  </button>
                </div>
                <hr />
              </div>
            ))}
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>{formatPrice(subtotal)}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>
                  {subtotal === 0 ? formatPrice(0) : formatPrice(delivery_fees)}
                </p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>{formatPrice(total)}</b>
              </div>
            </div>
            <button onClick={handleProceed} disabled={subtotal === 0}>
              PROCEED TO CHECKOUT
            </button>

            {showPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Continue Without Login?
                  </h2>
                  <p className="text-sm mb-4">
                    If you don’t log in, you won't be able to view your order
                    history or track orders.
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={handleLogin}
                      className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
                      Login for Full Benefits
                    </button>

                    <button
                      onClick={handleContinueGuest}
                      className="border border-gray-300 w-full py-2 rounded hover:bg-gray-100">
                      Continue as Guest
                    </button>
                  </div>

                  <button
                    className="mt-4 text-xs text-gray-500 underline"
                    onClick={() => setShowPopup(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
