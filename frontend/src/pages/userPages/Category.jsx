import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaLeaf, FaRegHeart, FaHeart } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { FiStar, FiClock } from "react-icons/fi";

const CategoryItemsPage = () => {
  const { location, categoryName } = useParams(); // updated to get both params
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/food/items/${encodeURIComponent(
            location
          )}/${encodeURIComponent(categoryName)}`
        );
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [location, categoryName]);

  const filteredItems = items.filter((item) => {
    if (typeFilter === "all") return true;
    return item.type === typeFilter;
  });

  const toggleFavorite = (id) =>
    setItems((prev) =>
      prev.map((it) =>
        it._id === id ? { ...it, isFavorite: !it.isFavorite } : it
      )
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-600 capitalize">
            {categoryName.replace(/-/g, " ")} in {location}
          </h1>
          <div className="flex gap-2">
            {["all", "veg", "nonveg"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 font-medium transition ${
                  typeFilter === type
                    ? type === "veg"
                      ? "bg-green-500 text-white"
                      : type === "nonveg"
                      ? "bg-red-500 text-white"
                      : "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}>
                {type === "veg" ? (
                  <>
                    <FaLeaf /> Veg
                  </>
                ) : type === "nonveg" ? (
                  <>
                    <GiChickenLeg /> Non-Veg
                  </>
                ) : (
                  "All"
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow h-72" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <div className="relative">
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(item._id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
                    {item.isFavorite ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <div className="flex items-center text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded">
                      <FiStar className="mr-1" />
                      {item.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{item.location}</p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1" />
                      {item.deliveryTime}
                    </div>
                    <span className="text-lg font-bold text-orange-600">
                      ₹{item.price}
                    </span>
                  </div>

                  <button className="mt-4 w-full py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItemsPage;
