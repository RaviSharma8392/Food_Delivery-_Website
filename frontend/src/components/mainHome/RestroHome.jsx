import { FaStar, FaClock, FaRupeeSign } from "react-icons/fa";

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div
      className="w-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200"
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
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
            {restaurant.offers}
          </div>
        )}

        {/* Delivery time */}
        {/* <div className="absolute bottom-2 right-2 bg-white text-gray-800 text-xs px-2 py-1 rounded font-medium shadow">
          {restaurant.deliveryTime} min
        </div> */}
      </div>

      {/* Restaurant Details */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg truncate mb-1">
          {restaurant.name}
        </h3>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded mr-2">
            <FaStar className="text-green-600 mr-1 text-xs" />
            <span className="font-semibold text-xs">
              {restaurant.avgRating}
            </span>
          </div>
          <span>•</span>
          <span className="mx-1 truncate">{restaurant.cuisine}</span>
          <span>•</span>
          <span className="ml-1">{restaurant.area}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <FaRupeeSign className="mr-1" />
          <span>{restaurant.costForTwo}</span>
        </div>

        {/* Quick view button */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          {/* <button
            className="w-full text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Quick view logic here
            }}>
            QUICK VIEW
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
