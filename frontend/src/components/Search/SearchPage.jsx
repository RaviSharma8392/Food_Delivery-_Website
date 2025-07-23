import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUtensils, FaSpinner } from "react-icons/fa";

// const BASE_URL = "http://localhost:3000/api/v1/public";
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/public`;
console.log(BASE_URL);

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    if (query) setSearchTerm(query);
  }, [location.search]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/foods`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to fetch food items");
        }

        setFoodItems(json.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to load food items. Please try again.");
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = foodItems.filter((item) => {
      return (
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        (typeof item.category === "string"
          ? item.category.toLowerCase().includes(term)
          : item.category?.name?.toLowerCase().includes(term)) ||
        (typeof item.restaurant === "string"
          ? item.restaurant.toLowerCase().includes(term)
          : item.restaurant?.name?.toLowerCase().includes(term))
      );
    });

    setFilteredItems(results);
  }, [searchTerm, foodItems]);

  const handleItemClick = async (restaurantId) => {
    try {
      const res = await fetch(`${BASE_URL}/restaurant/${restaurantId}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Restaurant not found");
      }

      const restaurant = json.data;
      const slug = restaurant.name.toLowerCase().replace(/\s+/g, "-");
      navigate(`/restaurant/${slug}`, { state: { restaurant } });
    } catch (err) {
      console.error("Error fetching restaurant:", err);
    }
  };

  const handleInputChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    navigate(`/search?query=${encodeURIComponent(newTerm)}`);
  };

  const renderPriceOptions = (options) => {
    if (!options || typeof options !== "object") return null;

    return (
      <div className="flex gap-2 mt-2">
        {Object.entries(options).map(([size, price]) => (
          <span
            key={size}
            className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            {size}: ₹{price}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Discover Menu Items
        </h1>
        <p className="text-gray-600">
          Search drinks, meals, and more from our partner restaurants.
        </p>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search items like 'Cold Drink', 'Pizza', etc..."
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-orange-500 text-3xl" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {searchTerm && !isLoading && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "Item" : "Items"} Found
          </h2>

          {filteredItems.length > 0 ? (
            <div className="grid gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleItemClick(item.restaurant)}
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all cursor-pointer bg-white">
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-food.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaUtensils className="text-2xl" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
                        <span className="text-sm font-medium text-blue-700">
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>

                    {renderPriceOptions(item.options)}

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      {item.category && (
                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {typeof item.category === "string"
                            ? item.category
                            : item.category?.name || "Food"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaUtensils className="mx-auto text-gray-300 text-4xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700">
                No items found for "{searchTerm}"
              </h3>
              <p className="text-gray-500 mt-2">
                Try different keywords or check our menu categories.
              </p>
            </div>
          )}
        </div>
      )}

      {!searchTerm && !isLoading && (
        <div className="text-center py-12">
          <FaSearch className="mx-auto text-gray-300 text-4xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700">
            Search for food and beverages
          </h3>
          <p className="text-gray-500 mt-2">
            Example: "Cold Drink", "Pizza", "Burger"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
