import React, { useState, useEffect } from "react";

// Dummy restaurant data
const dummyRestaurants = [
  {
    id: 1,
    name: "Lakeview Cafe",
    cuisine: "Multi-cuisine, Cafe",
    rating: 4.5,
    deliveryTime: "30-40 mins",
    image:
      "https://b.zmtcdn.com/data/pictures/chains/9/18351869/60e1e0c8f7c9b4d2b9b5a1a3c8a0f0f3.jpg",
    isPromoted: true,
    discount: "20% OFF",
  },
  {
    id: 2,
    name: "The Himalayan Dine",
    cuisine: "North Indian, Chinese",
    rating: 4.2,
    deliveryTime: "25-35 mins",
    image:
      "https://b.zmtcdn.com/data/pictures/9/18351869/9ddb9b0a5b7b0a5b7b0a5b7b0a5b7b0a.jpg",
    isPromoted: false,
    discount: "10% OFF",
  },
  {
    id: 3,
    name: "Bhimtal Retreat",
    cuisine: "Continental, Italian",
    rating: 4.7,
    deliveryTime: "35-45 mins",
    image:
      "https://b.zmtcdn.com/data/pictures/chains/9/18351869/9ddb9b0a5b7b0a5b7b0a5b7b0a5b7b0a.jpg",
    isPromoted: true,
    discount: "15% OFF",
  },
  {
    id: 4,
    name: "Naini's Delight",
    cuisine: "South Indian, Fast Food",
    rating: 4.0,
    deliveryTime: "20-30 mins",
    image:
      "https://b.zmtcdn.com/data/pictures/chains/9/18351869/9ddb9b0a5b7b0a5b7b0a5b7b0a5b7b0a.jpg",
    isPromoted: false,
    discount: null,
  },
  {
    id: 5,
    name: "Kumaon Kitchen",
    cuisine: "Kumaoni, North Indian",
    rating: 4.8,
    deliveryTime: "40-50 mins",
    image:
      "https://b.zmtcdn.com/data/pictures/chains/9/18351869/9ddb9b0a5b7b0a5b7b0a5b7b0a5b7b0a.jpg",
    isPromoted: true,
    discount: "25% OFF",
  },
];

const TopRestaurantsBhimtal = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const location = localStorage.getItem("userLocation") || "Bhimtal";

      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/restaurants/by-location/${location}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch");

        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <section className="px-4 py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Top Restaurants in Bhimtal
          </h2>
          <button className="text-green-600 font-medium hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                {restaurant.isPromoted && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
                    PROMOTED
                  </div>
                )}
                {restaurant.discount && (
                  <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded shadow">
                    {restaurant.discount}
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow">
                  <span className="mr-1">★</span> {restaurant.rating}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {restaurant.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  {restaurant.cuisine}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{restaurant.deliveryTime}</span>
                  <span>•</span>
                  <span>₹200 for two</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Currently using dummy data. Replace with API later.</p>
        </div>
      </div>
    </section>
  );
};

export default TopRestaurantsBhimtal;
