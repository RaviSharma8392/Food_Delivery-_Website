// src/pages/CategoryItemPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiClock, FiStar, FiChevronRight } from "react-icons/fi";
import { BsClockHistory, BsCurrencyRupee } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { RiRestaurantLine } from "react-icons/ri";

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
          {
            params: { location, category: formattedName },
          }
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

  // Custom Skeleton Loader Component
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
    <div className="bg-[#f5f5f5] min-h-screen pb-12">
      {/* Category Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#fc8019] to-[#f8462d] py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
            {loading ? (
              <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse border-4 border-white shadow-lg"></div>
            ) : (
              <img
                src={category?.image}
                alt={category?.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
              />
            )}
          </div>
          <div className="text-white">
            {loading ? (
              <>
                <div className="bg-gray-300 h-10 w-64 mb-3 animate-pulse rounded"></div>
                <div className="bg-gray-300 h-6 w-48 animate-pulse rounded"></div>
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {category?.name} in {location}
                </h1>
                <p className="text-lg opacity-90">
                  {restaurants.length}+ {category?.name} restaurants
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex overflow-x-auto scrollbar-hide">
          <button className="flex-shrink-0 px-4 py-2 mr-2 bg-[#fc8019] text-white rounded-full text-sm font-medium">
            Delivery Time
          </button>
          <button className="flex-shrink-0 px-4 py-2 mr-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50">
            Rating
          </button>
          <button className="flex-shrink-0 px-4 py-2 mr-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50">
            Cost: Low to High
          </button>
          <button className="flex-shrink-0 px-4 py-2 mr-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50">
            Pure Veg
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50">
            Offers
          </button>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6">
        {loading ? (
          <SkeletonLoader count={6} />
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No restaurants found
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any {category?.name} restaurants in {location}.
              Try searching for something else.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((rest) => (
              <div
                key={rest._id}
                onClick={() => handleClick(rest)}
                className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={rest.image || rest.logo}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18945b7b5b2%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18945b7b5b2%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2274.0859375%22%20y%3D%22104.5%22%3E200x200%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                      }}
                    />
                  </div>
                  {rest.avgRating && (
                    <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-full shadow flex items-center">
                      <FiStar className="text-yellow-500 mr-1 text-sm" />
                      <span className="font-bold text-sm">
                        {rest.avgRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                        {rest.name}
                      </h2>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <IoLocationOutline className="mr-1" />
                        <span className="line-clamp-1">
                          {rest.subLocation || rest.mainLocation}
                        </span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                      <span>4.0+</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <BsClockHistory className="mr-1" />
                        <span>{rest.deliveryTime || 30} mins</span>
                      </div>
                      <div className="flex items-center">
                        <BsCurrencyRupee className="mr-1" />
                        <span>{rest.costForTwo || "500 for two"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-20">
        <button className="bg-[#fc8019] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all">
          <RiRestaurantLine className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default CategoryItemPage;
