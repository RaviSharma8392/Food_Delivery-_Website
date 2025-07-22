import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiClock,
  FiStar,
  FiMapPin,
  FiFilter,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import {
  GiChickenLeg,
  GiNoodles,
  GiSandwich,
  GiKnifeFork,
  GiSushis,
} from "react-icons/gi";
import { BiDrink, BiDish } from "react-icons/bi";
import { IoFastFoodOutline } from "react-icons/io5";

const RestaurantsPageLists = () => {
  // State management
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data - replace with API call
  useEffect(() => {
    const mockRestaurants = [
      {
        _id: "1",
        name: "Himalayan Spice",
        address: "Mall Road, Nainital",
        mainLocation: "Nainital",
        subLocation: "Mall Road",
        cuisine: ["North Indian", "Chinese"],
        avgRating: 4.5,
        deliveryTime: 25,
        costForTwo: "₹600",
        minOrder: "₹150",
        image: "https://source.unsplash.com/random/600x400/?himalayan,food",
        promoted: true,
        discount: "40% OFF",
        tags: ["Pure Veg", "Bestseller"],
      },
      // Add 7+ more restaurant objects...
    ];

    setRestaurants(mockRestaurants);
    setFilteredRestaurants(mockRestaurants);

    // Extract unique filters
    setLocations([
      "All",
      ...new Set(mockRestaurants.map((r) => r.mainLocation)),
    ]);
    setCuisines([
      "North Indian",
      "Chinese",
      "Italian",
      "South Indian",
      "Desserts",
      "Beverages",
    ]);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let results = restaurants;

    // Location filter
    if (selectedLocation !== "All") {
      results = results.filter((r) => r.mainLocation === selectedLocation);
    }

    // Cuisine filter
    if (selectedCuisines.length > 0) {
      results = results.filter((r) =>
        selectedCuisines.some((cuisine) => r.cuisine.includes(cuisine))
      );
    }

    // Search filter
    if (searchQuery) {
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.join(", ").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRestaurants(results);
  }, [selectedLocation, selectedCuisines, searchQuery, restaurants]);

  const toggleCuisine = (cuisine) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleRestaurantClick = (restaurant) => {
    const slug = restaurant.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/restaurant/${slug}`, { state: { restaurant } });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-700">
          Loading delicious options...
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-gray-50  mt-12 min-h-screen pb-20">
      {/* Search Header (Sticky) */}
      <header className="sticky top-0 z-30 bg-white shadow-sm px-4 py-3">
        <div className="flex items-center">
          <div className="relative flex-grow mr-2">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {searchQuery && (
              <FiX
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg ${
              showFilters
                ? "bg-orange-100 text-orange-500"
                : "bg-gray-100 text-gray-600"
            }`}>
            <FiFilter />
          </button>
        </div>
      </header>

      {/* Filter Panel (Slide-in) */}
      {showFilters && (
        <div className="fixed inset-0 z-40 bg-white pt-16 px-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-orange-500 font-medium">
              Apply
            </button>
          </div>

          {/* Location Filter */}
          <div className="mb-8">
            <h3 className="flex items-center text-gray-700 mb-3">
              <FiMapPin className="mr-2" />
              Select Location
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`py-2 px-3 rounded-lg text-sm ${
                    selectedLocation === location
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Filter */}
          <div className="mb-8">
            <h3 className="flex items-center text-gray-700 mb-3">
              <BiDish className="mr-2" />
              Select Cuisines
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {cuisines.map((cuisine) => {
                const Icon = getCuisineIcon(cuisine);
                return (
                  <button
                    key={cuisine}
                    onClick={() => toggleCuisine(cuisine)}
                    className={`py-2 px-3 rounded-lg text-sm flex items-center ${
                      selectedCuisines.includes(cuisine)
                        ? "bg-orange-100 text-orange-600 border border-orange-200"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    {Icon && <Icon className="mr-2" />}
                    {cuisine}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 pt-4">
        {/* Location Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiMapPin className="text-orange-500 mr-1" />
            <span className="font-medium">
              {selectedLocation === "All" ? "All Locations" : selectedLocation}
            </span>
            <FiChevronDown className="ml-1 text-gray-500" />
          </div>
          <span className="text-sm text-gray-500">
            {filteredRestaurants.length} places
          </span>
        </div>

        {/* Active Filters */}
        {(selectedCuisines.length > 0 || selectedLocation !== "All") && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedLocation !== "All" && (
              <div className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs">
                {selectedLocation}
                <FiX
                  className="ml-1 cursor-pointer"
                  onClick={() => setSelectedLocation("All")}
                />
              </div>
            )}
            {selectedCuisines.map((cuisine) => (
              <div
                key={cuisine}
                className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs">
                {cuisine}
                <FiX
                  className="ml-1 cursor-pointer"
                  onClick={() => toggleCuisine(cuisine)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Promoted Section */}
        {filteredRestaurants.filter((r) => r.promoted).length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-3">Featured Restaurants</h2>
            <div className="relative">
              <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div
                  className="flex space-x-3"
                  style={{
                    width: `${
                      filteredRestaurants.filter((r) => r.promoted).length * 85
                    }%`,
                  }}>
                  {filteredRestaurants
                    .filter((r) => r.promoted)
                    .map((restaurant) => (
                      <PromotedRestaurantCard
                        key={restaurant._id}
                        restaurant={restaurant}
                        onClick={handleRestaurantClick}
                      />
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Restaurants */}
        <section>
          <h2 className="text-lg font-bold mb-3">All Restaurants</h2>
          {filteredRestaurants.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <BiDish className="mx-auto text-4xl text-gray-300 mb-3" />
              <h3 className="text-gray-700 font-medium mb-1">
                No restaurants found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Try changing your filters
              </p>
              <button
                onClick={() => {
                  setSelectedLocation("All");
                  setSelectedCuisines([]);
                  setSearchQuery("");
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  onClick={handleRestaurantClick}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// Cuisine Icons Mapping
const getCuisineIcon = (cuisine) => {
  switch (cuisine) {
    case "North Indian":
      return GiChickenLeg;
    case "Chinese":
      return GiNoodles;
    case "Italian":
      return GiSandwich;
    case "South Indian":
      return GiCurry;
    case "Desserts":
      return BiDrink;
    case "Beverages":
      return BiDrink;
    default:
      return IoFastFoodOutline;
  }
};

// Promoted Restaurant Card (Horizontal Scroll)
const PromotedRestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div
      className="w-80 flex-shrink-0 bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
      onClick={() => onClick(restaurant)}>
      <div className="relative h-40">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {restaurant.discount && (
          <div className="absolute top-2 right-2 bg-white text-orange-600 font-bold px-2 py-1 rounded text-xs shadow">
            {restaurant.discount}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-gray-900 truncate">{restaurant.name}</h3>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <FiMapPin className="mr-1" />
          <span className="truncate">{restaurant.subLocation}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center bg-green-50 px-2 py-1 rounded text-xs">
            <FiStar className="text-yellow-500 mr-1" />
            <span className="font-medium">{restaurant.avgRating}</span>
          </div>
          <div className="text-xs text-gray-600">
            {restaurant.deliveryTime} mins
          </div>
        </div>
      </div>
    </div>
  );
};

// Regular Restaurant Card
const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
      onClick={() => onClick(restaurant)}>
      <div className="flex">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3 flex-grow">
          <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <FiMapPin className="mr-1" />
            <span>{restaurant.subLocation}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {restaurant.cuisine.slice(0, 2).map((cuisine, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                {cuisine}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center bg-green-50 px-2 py-1 rounded text-xs">
              <FiStar className="text-yellow-500 mr-1" />
              <span className="font-medium">{restaurant.avgRating}</span>
            </div>
            <div className="text-xs text-gray-600">
              {restaurant.deliveryTime} mins • {restaurant.costForTwo}
            </div>
          </div>
          <h1>who you</h1>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPageLists;
