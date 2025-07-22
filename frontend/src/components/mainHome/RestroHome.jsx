import { FaStar, FaClock, FaRupeeSign } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div
      className="w-full bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
      onClick={onClick}>
      {/* Restaurant Image */}
      <div className="relative h-48">
        <img
          src={
            restaurant.image ||
            "https://b.zmtcdn.com/data/pictures/chains/9/18351869/60e1e0c8f7c9b4d2b9b5a1a3c8a0f0f3.jpg"
          }
          alt={restaurant.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Promoted Tag */}
        {restaurant.promoted && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
            PROMOTED
          </div>
        )}

        {/* Discount Tag */}
        {restaurant.offers && (
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            {restaurant.offers}
          </div>
        )}
      </div>

      {/* Restaurant Details */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-800 text-lg truncate pr-2">
            {restaurant.name}
          </h3>
          <div className="flex items-center bg-green-50 px-2 py-1 rounded">
            <FaStar className="text-green-600 mr-1 text-sm" />
            <span className="font-semibold text-sm">
              {restaurant.avgRating}
            </span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <span className="truncate mr-2">{restaurant.cuisine}</span>
          <span className="mx-1">•</span>
          <span>{restaurant.area}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-2">
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center">
            <FaRupeeSign className="mr-1" />
            <span>{restaurant.costForTwo}</span>
          </div>
        </div>

        {/* Quick Action Button */}
        {/* <button
          className="w-full mt-3 bg-orange-50 hover:bg-orange-100 text-orange-600 py-2 rounded-lg flex items-center justify-center font-medium text-sm transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}>
          <FiPlus className="mr-1" />
          QUICK VIEW
        </button> */}
      </div>
    </div>
  );
};

export default RestaurantCard;
