import React, { useState } from "react";
import "./FoodItem.css";
import { useCartContext } from "../../context/cartContext";

// SVG Icon Components
const AddIconWhite = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AddIconGreen = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 12H19" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const RemoveIconRed = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="#F44336" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const RatingStars = () => (
  <svg
    width="80"
    height="16"
    viewBox="0 0 80 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
      fill="#FFD700"
    />
    <path
      d="M24 0L25.7961 5.52786H31.6085L26.9062 8.94427L28.7023 14.4721L24 11.0557L19.2977 14.4721L21.0938 8.94427L16.3915 5.52786H22.2039L24 0Z"
      fill="#FFD700"
    />
    <path
      d="M40 0L41.7961 5.52786H47.6085L42.9062 8.94427L44.7023 14.4721L40 11.0557L35.2977 14.4721L37.0938 8.94427L32.3915 5.52786H38.2039L40 0Z"
      fill="#FFD700"
    />
    <path
      d="M56 0L57.7961 5.52786H63.6085L58.9062 8.94427L60.7023 14.4721L56 11.0557L51.2977 14.4721L53.0938 8.94427L48.3915 5.52786H54.2039L56 0Z"
      fill="#FFD700"
    />
    <path
      d="M72 0L73.7961 5.52786H79.6085L74.9062 8.94427L76.7023 14.4721L72 11.0557L67.2977 14.4721L69.0938 8.94427L64.3915 5.52786H70.2039L72 0Z"
      fill="#FFD700"
    />
  </svg>
);

const FoodItem = ({ id, name, description, image, options }) => {
  const { cart, addToCart, removeFromCart } = useCartContext();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const formatPortion = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const portionKey = selectedOption?.portion || Object.keys(options)[0];
  const matchedItem = cart.find(
    (item) => item.id === id && item.portion === portionKey
  );
  const quantity = matchedItem ? matchedItem.quantity : 0;

  const handleOptionChange = (e) => {
    const [portion, price] = e.target.value.split("|");
    setSelectedOption({ portion, price: parseFloat(price) });
  };

  const handleAddToCart = () => {
    const portion = portionKey;
    const price = parseFloat(options[portion]);
    addToCart(id, 1, portion, { name, image, price });
  };

  const handleRemoveFromCart = () => {
    removeFromCart(id, portionKey);
  };

  const handlePopupAdd = (portion, price) => {
    setSelectedOption({ portion, price: parseFloat(price) });
    addToCart(id, 1, portion, { name, image, price });
    setShowPopup(false);
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
        {quantity > 0 ? (
          <div className="food-item-counter">
            <button onClick={handleRemoveFromCart} className="icon-button">
              <RemoveIconRed />
            </button>
            <p>{quantity}</p>
            <button onClick={handleAddToCart} className="icon-button">
              <AddIconGreen />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              if (Object.keys(options).length === 1) {
                handleAddToCart();
              } else {
                setShowPopup(true);
              }
            }}
            className="add-btn icon-button">
            <AddIconWhite />
          </button>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p className="food-name">{name}</p>
          <RatingStars />
        </div>
        <p className="food-item-desc">{description}</p>

        <div className="food-item-options">
          {Object.keys(options).length === 1 ? (
            <div className="single-price-display">
              <p className="item-price">
                <strong>{formatPortion(Object.keys(options)[0])}</strong> | ₹
                {Object.values(options)[0]}
              </p>
              <button className="buy-now-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          ) : (
            <>
              <div className="custom-select-wrapper">
                <select
                  className="custom-select"
                  onChange={handleOptionChange}
                  value={
                    selectedOption
                      ? `${selectedOption.portion}|${selectedOption.price}`
                      : ""
                  }>
                  <option value="">Select portion size</option>
                  {Object.entries(options).map(([portion, price]) => (
                    <option key={portion} value={`${portion}|${price}`}>
                      {formatPortion(portion)} - ₹{price}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOption && (
                <div className="selected-option-display">
                  <div className="selected-portion">
                    <strong>{formatPortion(selectedOption.portion)}</strong> | ₹
                    {selectedOption.price}
                  </div>
                  <button className="buy-now-btn" onClick={handleAddToCart}>
                    {quantity > 0 ? "Add More" : "Add to Cart"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="portion-popup-overlay">
          <div className="portion-popup">
            <h3>Select Portion Size</h3>
            <div className="portion-options">
              {Object.entries(options).map(([portion, price]) => (
                <div
                  key={portion}
                  className="portion-option"
                  onClick={() => handlePopupAdd(portion, price)}>
                  <span className="portion-name">{formatPortion(portion)}</span>
                  <span className="portion-price">₹{price}</span>
                </div>
              ))}
            </div>
            <button className="close-popup" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
