import React, { useState, useEffect } from "react";
import { FiSearch, FiStar, FiMapPin } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ onChangeLocation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("Select Location");
  const navigate = useNavigate();

  // Load city from localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem("userCity");
    if (savedCity) {
      setCity(savedCity.charAt(0).toUpperCase() + savedCity.slice(1));
    }
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="hidden md:flex relative bg-gradient-to-br from-[#fff8f1] to-[#ffefe2] text-gray-900 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Delicious Food Delivery | CraveEats</title>
        <meta
          name="description"
          content="Get food delivered quickly from the best local restaurants in Kumaon."
        />
      </Helmet>

      {/* Decorative Blob */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-300 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="relative z-10">
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Serving the Kumaon Region
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            <span className="block text-gray-800">From Naini's Shores to</span>
            <span className="block text-orange-600">
              Your Doorstep in Minutes
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-lg">
            Savor authentic Kumaoni flavors or explore global cuisines — fast,
            fresh, and right to your home.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mb-8">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <FiSearch className="text-orange-500 text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search for Momos, Thukpa, or restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full py-3 pl-12 pr-32 rounded-full shadow-sm border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-800"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md">
              Search
            </button>
          </div>

          {/* Location Display + Change Button */}
          <div
            className="mt-4 bg-white/80 backdrop-blur-sm py-3 px-4 rounded-full shadow-sm inline-flex items-center text-sm font-medium cursor-pointer hover:shadow-md transition"
            onClick={onChangeLocation}>
            <FiMapPin className="text-orange-500 mr-2" />
            Delivering to: {city}
            <span className="ml-2 text-orange-500 underline text-xs font-semibold">
              (Change)
            </span>
          </div>
        </div>

        {/* Image */}
        <div className="relative z-10 flex justify-center md:justify-end">
          <div className="relative w-full max-w-md">
            <img
              src="/image.png"
              alt="Happy delivery"
              className="h-100 animate-float"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-xl shadow-lg border border-orange-100 hidden sm:block">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FiStar className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Average Rating</p>
                  <p className="font-bold text-orange-600">4.8 ★ (2,500+)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
