// sections/PopularRestaurants.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { FiStar, FiClock } from "react-icons/fi";

const dummyRestaurants = [
  {
    id: 1,
    name: "Tandoori Treats",
    cuisine: "North Indian, Mughlai",
    image: "https://source.unsplash.com/400x300/?restaurant,food",
    rating: 4.5,
    deliveryTime: "30 mins",
    isVegan: false,
  },
  {
    id: 2,
    name: "Green Leaf Cafe",
    cuisine: "Healthy, Vegan",
    image: "https://source.unsplash.com/400x300/?vegan,food",
    rating: 4.7,
    deliveryTime: "25 mins",
    isVegan: true,
  },
  {
    id: 3,
    name: "Spice Symphony",
    cuisine: "Indian, Chinese",
    image: "https://source.unsplash.com/400x300/?spicy,food",
    rating: 4.3,
    deliveryTime: "35 mins",
    isVegan: false,
  },
  {
    id: 4,
    name: "Mountain Meals",
    cuisine: "Local Cuisine",
    image: "https://source.unsplash.com/400x300/?mountain,food",
    rating: 4.6,
    deliveryTime: "28 mins",
    isVegan: false,
  },
];

const PopularRestaurants = () => {
  return (
    <div className="py-12 px-4 md:px-8 lg:px-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Popular Restaurants
          </h2>
          <Link
            to="/restaurants"
            className="text-orange-500 hover:text-orange-600 font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                {restaurant.isVegan && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <FaLeaf className="mr-1" /> Vegan
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {restaurant.cuisine}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-yellow-500">
                    <FiStar className="mr-1" />
                    <span className="text-gray-800 font-medium">
                      {restaurant.rating}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FiClock className="mr-1" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularRestaurants;
