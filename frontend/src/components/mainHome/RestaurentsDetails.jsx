// React and library imports
import { useState, useEffect } from "react";
import { FaStar, FaClock, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Local components and hooks
import RestaurantCard from "./RestroHome";
import { useDebounce } from "../../hooks/useDebounce";
import { fetchRestaurantsByCity } from "../../services/restaurents/manageFoodApi"; // Extracted API logic

const RestaurantList = () => {
  // Get user's city from local storage, fallback to 'bhimtal'
  const city = localStorage.getItem("userCity") || "bhimtal";

  // State management
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce to optimize performance

  const [filters, setFilters] = useState({ rating: 0, fastDelivery: false });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navigate = useNavigate();

  // Placeholder skeleton cards for loading state
  const defaultRestaurants = Array(8).fill({ id: 0 });

  // Fetch restaurant data on mount or when city changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchRestaurantsByCity(city);
        setRestaurants(data.map((item) => ({ ...item, id: item._id })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city]);

  // Apply search, rating, and delivery filters to restaurants
  const filteredRestaurants = restaurants
    .filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        r.cuisine?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesRating = r.avgRating >= filters.rating;
      const matchesDelivery =
        !filters.fastDelivery || parseInt(r.deliveryTime) <= 30;

      return matchesSearch && matchesRating && matchesDelivery;
    })
    .sort((a, b) => b.promoted - a.promoted || b.avgRating - a.avgRating); // Promoted and higher-rated first

  // Navigate to restaurant page on click
  const handleRestaurantClick = (restaurant) => {
    const slug = restaurant.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/restaurant/${slug}`, { state: { restaurant } });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({ rating: 0, fastDelivery: false });
    setSearchTerm("");
  };

  // Error fallback UI
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen px-4 bg-white">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white mt-20 min-h-screen">
      {/* SEO metadata */}
      <Helmet>
        <title>
          Top Restaurants in {city} | Best Food Delivery in {city} - TasteKumaon
        </title>
        <meta
          name="description"
          content={`Find the best restaurants in ${city} for North Indian, Chinese, Kumaoni, and more.`}
        />
        <link
          rel="canonical"
          href={`https://munchizo.com/restaurants/${city.toLowerCase()}`}
        />
      </Helmet>

      {/* Sticky page header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          {/* Desktop & Tablet View */}
          <div className="hidden sm:block">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Discover the best restaurant in{" "}
              <span className=" text-gray-900">
                {city
                  ? city.charAt(0).toUpperCase() + city.slice(1)
                  : "your city"}
              </span>
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Order from top-rated restaurants near you • Fast delivery • Great
              deals
            </p>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden">
            <h1 className="text-xl font-bold text-gray-900 leading-snug">
              Best restaurants in{" "}
              <span className=" text-gray-900">
                {city
                  ? city.charAt(0).toUpperCase() + city.slice(1)
                  : "your area"}
              </span>
            </h1>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span className="flex items-center mr-3">
                <FaStar className="text-yellow-400 mr-1" /> 4.5+ Ratings
              </span>
              <span className="flex items-center">
                <FaClock className="mr-1" /> 30-45 min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar and filter UI */}
      <div className="bg-gray-50 ">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for restaurants or cuisines"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Mobile filter button (optional) */}
            <div className="hidden gap-2">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                <FaFilter className="text-gray-600" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant list section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {loading
              ? "Loading..."
              : `${filteredRestaurants.length} restaurants`}
          </h2>

          {/* Clear filters button */}
          {!loading && (filters.rating > 0 || filters.fastDelivery) && (
            <button
              onClick={resetFilters}
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1">
              <FaTimes />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Restaurant cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton loaders
            defaultRestaurants.map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : filteredRestaurants.length > 0 ? (
            // Render filtered restaurant cards
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => handleRestaurantClick(restaurant)}
              />
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  No restaurants found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
