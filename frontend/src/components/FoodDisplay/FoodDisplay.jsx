import React, { useEffect, useState, useMemo } from "react";
import FoodItem from "../FoodItem/FoodItem";
import { publicAPI } from "../../api/index";
import {
  FiSearch,
  FiMapPin,
  FiPhone,
  FiClock,
  FiStar,
  FiChevronDown,
} from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { useMediaQuery } from "react-responsive";

const FoodDisplay = ({ restaurantId }) => {
  // State management
  const [restaurantData, setRestaurantData] = useState({
    restaurant: null,
    menu: [],
    categories: [],
  });
  const [filterItems, setFilterItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Fetch restaurant data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await publicAPI.fetchRestaurantDetails(restaurantId);

        if (response?.success) {
          setRestaurantData({
            restaurant: response.data.restaurant,
            menu: response.data.menu || [],
            categories: response.data.categories || [],
          });
          setFilterItems(response.data.menu || []);
        }
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  // Memoized filtered data
  const filteredCategories = useMemo(() => {
    return restaurantData.categories.filter((category) =>
      filterItems.some((item) => item.category?._id === category._id)
    );
  }, [restaurantData.categories, filterItems]);

  // Filter function
  const filterData = (category = activeCategory, term = searchTerm) => {
    let filtered = [...restaurantData.menu];

    if (category !== "all") {
      filtered = filtered.filter((item) => item.category?._id === category);
    }

    if (term.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(term.toLowerCase()) ||
          item.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    setSearchTerm(term);
    setActiveCategory(category);
    setFilterItems(filtered);
  };

  // Toggle item expansion
  const toggleItemExpand = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading restaurant menu...</p>
      </div>
    );
  }

  // Error state
  if (!restaurantData.restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Restaurant not found
        </h3>
        <p className="text-gray-600">
          We couldn't find the restaurant you're looking for
        </p>
      </div>
    );
  }

  const { restaurant, categories } = restaurantData;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SEO Meta & Structured Data */}
      <Helmet>
        <title>{restaurant.name} | Order Online | CraveEats</title>
        <meta
          name="description"
          content={
            restaurant.description ||
            "Delicious food delivered from your favorite restaurant."
          }
        />
        <meta property="og:title" content={restaurant.name} />
        <meta property="og:description" content={restaurant.description} />
        <meta property="og:image" content={restaurant.coverImage} />
        <meta property="og:type" content="restaurant" />
        <link
          rel="canonical"
          href={`https://yourdomain.com/restaurant/${
            restaurant.slug || restaurant._id
          }`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: restaurant.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: restaurant.location || "Bhimtal",
              addressRegion: "Uttarakhand",
              addressCountry: "India",
            },
            servesCuisine: restaurant.cuisineType?.split(", "),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: restaurant.rating || "4.5",
              reviewCount: restaurant.totalRatings || 45,
            },
          })}
        </script>
      </Helmet>

      {/* Restaurant Header Section */}
      <section className="relative">
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <img
            src={
              restaurant.coverImage ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
            }
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-opacity-40 flex items-end">
            <div className="w-full p-4 md:p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold">
                {restaurant.name}
              </h1>
              <p className="text-sm md:text-base opacity-90 mt-1">
                {restaurant.cuisineType || "Multi-cuisine"}
              </p>
              <div className="flex items-center mt-2 text-sm md:text-base">
                <span className="flex items-center mr-4">
                  <FiStar className="mr-1 text-yellow-400" />{" "}
                  {restaurant.rating || "4.5"}
                </span>
                <span>{restaurant.deliveryTime || "30-40 mins"} delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <FiMapPin className="text-orange-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">Location</h4>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
              </div>
            </div>
            {/* <div className="flex items-start">
              <FiPhone className="text-orange-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">Contact</h4>
                <p className="text-sm text-gray-600">{restaurant.phone}</p>
              </div>
            </div> */}
            <div className="flex items-start">
              <FiClock className="text-orange-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">Hours</h4>
                <p className="text-sm text-gray-600">
                  {restaurant.openingHours || "9:00 AM - 9:00 PM"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="sticky top-0 z-10 bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md mb-4">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => filterData(activeCategory, e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {isMobile ? (
            <div className="relative">
              <button
                className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg"
                onClick={() => setShowMobileCategories(!showMobileCategories)}>
                <span>
                  {activeCategory === "all"
                    ? "All Categories"
                    : categories.find((c) => c._id === activeCategory)?.name ||
                      "Select Category"}
                </span>
                <FiChevronDown
                  className={`transition-transform ${
                    showMobileCategories ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {showMobileCategories && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <button
                    className={`w-full text-left px-4 py-2 ${
                      activeCategory === "all"
                        ? "bg-orange-50 text-orange-600"
                        : ""
                    }`}
                    onClick={() => {
                      filterData("all");
                      setShowMobileCategories(false);
                    }}>
                    All Menu
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      className={`w-full text-left px-4 py-2 ${
                        activeCategory === category._id
                          ? "bg-orange-50 text-orange-600"
                          : ""
                      }`}
                      onClick={() => {
                        filterData(category._id);
                        setShowMobileCategories(false);
                      }}>
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => filterData("all")}>
                All Menu
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    activeCategory === category._id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => filterData(category._id)}>
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Menu Section */}
      <section className="container mx-auto px-4 py-6">
        {filterItems.length > 0 ? (
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="divide-y divide-gray-100">
                  {filterItems
                    .filter((item) => item.category?._id === category._id)
                    .map((food) => (
                      <FoodItem
                        key={food._id}
                        id={food._id}
                        name={food.name}
                        description={food.description}
                        image={food.imageUrl}
                        options={food.options}
                        price={food.price}
                        dietaryInfo={food.dietaryInfo}
                        isExpanded={expandedItem === food._id}
                        onExpand={() => toggleItemExpand(food._id)}
                        restaurantId={restaurant._id}
                        restaurantName={restaurant.name}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
              alt="No items found"
              className="w-48 h-48 object-contain"
            />
            <h3 className="text-xl font-bold text-gray-800 mt-4">
              No menu items found
            </h3>
            <p className="text-gray-600 mt-1">
              Try changing your category or search criteria
            </p>
            <button
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              onClick={() => filterData("all", "")}>
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default FoodDisplay;
