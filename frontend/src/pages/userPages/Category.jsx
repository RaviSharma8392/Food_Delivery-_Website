import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiStar, FiChevronRight } from "react-icons/fi";
import { FaMotorcycle, FaRupeeSign, FaMapMarkerAlt } from "react-icons/fa";
import { RiLeafLine } from "react-icons/ri";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategoryItemPage = () => {
  const { location, categoryName } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantsByCategory = async () => {
      setLoading(true);
      try {
        const formattedName = categoryName.replace(/-/g, " ");
        const res = await axios.get(
          `${BASE_URL}/api/v1/public/restaurant/by-location-category`,
          { params: { location, category: formattedName } }
        );
        setRestaurants(res.data?.restaurants || []);
        setCategory(res.data?.category || null);
      } catch (error) {
        console.error("Error fetching category restaurants:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantsByCategory();
  }, [location, categoryName]);

  const handleClick = (restaurant) => {
    const slug = restaurant.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/restaurant/${slug}`);
  };

  // Skeleton Loader
  const SkeletonLoader = ({ count = 6 }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow overflow-hidden">
            <div className="bg-gray-200 h-48 animate-pulse"></div>
            <div className="p-4">
              <div className="bg-gray-200 h-6 w-3/4 mb-3 animate-pulse rounded"></div>
              <div className="bg-gray-200 h-4 w-1/2 mb-4 animate-pulse rounded"></div>
              <div className="flex justify-between">
                <div className="bg-gray-200 h-4 w-1/3 animate-pulse rounded"></div>
                <div className="bg-gray-200 h-4 w-1/3 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8">
              {category?.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              ) : (
                <span className="text-4xl">🍕</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {category?.name || "Loading..."} in {location}
              </h1>
              <p className="text-white text-opacity-90">
                {restaurants.length}+ restaurants delivering now
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Restaurant Grid */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No restaurants found
            </h2>
            <p className="text-gray-500 mb-4">
              We couldn't find any {category?.name} restaurants in {location}.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => handleClick(restaurant)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group">
                {/* Restaurant Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image || restaurant.logo}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Restaurant+Image";
                    }}
                  />

                  {/* Rating Badge */}
                  {restaurant.avgRating && (
                    <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-full shadow flex items-center">
                      <FiStar className="text-yellow-500 mr-1" />
                      <span className="font-bold text-sm">
                        {restaurant.avgRating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Veg/Non-Veg Indicator */}
                  {restaurant.vegOnly && (
                    <div className="absolute top-3 left-3 bg-green-50 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                      <RiLeafLine className="mr-1" />
                      Pure Veg
                    </div>
                  )}
                </div>

                {/* Restaurant Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="pr-2">
                      <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                        {restaurant.name}
                      </h2>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <FaMapMarkerAlt className="mr-1 text-xs" />
                        <span className="line-clamp-1">
                          {restaurant.subLocation || restaurant.mainLocation}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        {restaurant.avgRating
                          ? `${restaurant.avgRating.toFixed(1)} ★`
                          : "4.0+ ★"}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaMotorcycle className="mr-1 text-orange-500" />
                        <span>{restaurant.deliveryTime || 30} mins</span>
                      </div>
                      <div className="flex items-center">
                        <FaRupeeSign className="mr-1" />
                        <span>{restaurant.costForTwo || "₹500 for two"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItemPage;
