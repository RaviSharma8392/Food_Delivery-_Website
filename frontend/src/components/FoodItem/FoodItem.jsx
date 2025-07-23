import React, { useState, useEffect } from "react";
import { useCartContext } from "../../context/cartContext";
import { toast } from "react-toastify"; // ✅ Import toast for notifications

// ⭐ Icon Components
const AddIconWhite = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AddIconGreen = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 12H19" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const RemoveIconRed = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19" stroke="#F44336" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const RatingStars = () => (
  <svg width="80" height="16" viewBox="0 0 80 16" fill="none">
    {[...Array(5)].map((_, i) => (
      <path
        key={i}
        d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
        transform={`translate(${i * 16}, 0)`}
        fill="#FFD700"
      />
    ))}
  </svg>
);

// 🍔 Main Component
const FoodItem = ({
  id,
  name,
  description,
  image,
  options,
  restaurantId,
  restaurantName,
}) => {
  const { cart, addToCart, removeFromCart } = useCartContext();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // 👇 Auto-select portion if only one is available
  useEffect(() => {
    if (options && Object.keys(options).length === 1) {
      const portion = Object.keys(options)[0];
      const price = parseFloat(options[portion]);
      setSelectedOption({ portion, price });
    }
  }, [options]);

  if (!options || Object.keys(options).length === 0) return null;

  const formatPortion = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const portionKey = selectedOption?.portion || Object.keys(options)[0];

  // 🔍 Get current quantity in cart for this item+portion
  const matchedItem = cart.find(
    (item) => item.id === id && item.portion === portionKey
  );
  const quantity = matchedItem ? matchedItem.quantity : 0;

  // 👇 Handle user changing the portion dropdown
  const handleOptionChange = (e) => {
    const [portion, price] = e.target.value.split("|");
    setSelectedOption({ portion, price: parseFloat(price) });
  };

  // ➕ Add item to cart and show toast
  const handleAddToCart = () => {
    const portionKey = selectedOption?.portion || Object.keys(options)[0];
    const portionPrice =
      selectedOption?.price || parseFloat(options[portionKey]);

    const itemWithPrice = { _id: id, name, image, price: portionPrice };

    if (!restaurantId || !restaurantName) {
      console.warn("Missing restaurantId or restaurantName");
      return;
    }

    addToCart(
      itemWithPrice,
      portionKey,
      portionPrice,
      1,
      restaurantId,
      restaurantName
    );
    toast.success(`${name} added to cart! ✅`);
  };

  // ➖ Remove item from cart
  const handleRemoveFromCart = () => {
    removeFromCart(id, portionKey);
  };

  // Popup → Select size then add
  const handlePopupAdd = (portion, price) => {
    const parsedPrice = parseFloat(price);
    setSelectedOption({ portion, price: parsedPrice });

    addToCart(
      { _id: id, name, image, price: parsedPrice },
      portion,
      parsedPrice,
      1,
      restaurantId,
      restaurantName
    );

    toast.success(`${name} (${formatPortion(portion)}) added to cart! ✅`);
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* 📷 Image */}
      <div className="relative w-full md:w-40 h-40 md:h-auto">
        <img className="w-full h-full object-cover" src={image} alt={name} />
        {quantity > 0 ? (
          // 🧮 Quantity + Add/Remove
          <div className="absolute bottom-2 right-2 flex items-center bg-white rounded-full shadow-md">
            <button
              onClick={handleRemoveFromCart}
              className="p-1 text-red-500 hover:bg-red-50 rounded-full">
              <RemoveIconRed />
            </button>
            <span className="px-2 font-medium">{quantity}</span>
            <button
              onClick={handleAddToCart}
              className="p-1 text-green-500 hover:bg-green-50 rounded-full">
              <AddIconGreen />
            </button>
          </div>
        ) : (
          // ➕ Add button (default)
          <button
            onClick={() => {
              if (Object.keys(options).length === 1) {
                handleAddToCart();
              } else {
                setShowPopup(true);
              }
            }}
            className="absolute bottom-2 right-2 p-2 bg-orange-500 hover:bg-orange-600 rounded-full shadow-md">
            <AddIconWhite />
          </button>
        )}
      </div>

      {/* 📄 Info */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <RatingStars />
        </div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        {/* 📦 Option Selector */}
        <div className="mt-auto">
          {Object.keys(options).length === 1 ? (
            <div className="flex justify-between items-center">
              <p className="text-gray-800 font-medium">
                <span className="font-semibold">
                  {formatPortion(Object.keys(options)[0])}
                </span>{" "}
                | ₹{Object.values(options)[0]}
              </p>
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium">
                {quantity > 0 ? "Add More" : "Add to Cart"}
              </button>
            </div>
          ) : (
            <>
              {/* 👇 Dropdown for multiple sizes */}
              <div className="mb-3">
                <select
                  onChange={handleOptionChange}
                  value={
                    selectedOption
                      ? `${selectedOption.portion}|${selectedOption.price}`
                      : ""
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Select portion size</option>
                  {Object.entries(options).map(([portion, price]) => (
                    <option key={portion} value={`${portion}|${price}`}>
                      {formatPortion(portion)} - ₹{price}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOption && (
                <div className="flex justify-between items-center">
                  <div className="text-gray-800 font-medium">
                    <span className="font-semibold">
                      {formatPortion(selectedOption.portion)}
                    </span>{" "}
                    | ₹{selectedOption.price}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium">
                    {quantity > 0 ? "Add More" : "Add to Cart"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 🔘 Popup to choose portion */}
      {showPopup && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Select Portion Size</h3>
            <div className="space-y-2 mb-6">
              {Object.entries(options).map(([portion, price]) => (
                <div
                  key={portion}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePopupAdd(portion, price)}>
                  <span className="font-medium">{formatPortion(portion)}</span>
                  <span className="text-orange-500 font-semibold">
                    ₹{price}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
              onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
