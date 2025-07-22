import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sample list of predefined food categories with images
const categories = [
  // Add more categories as needed
  {
    id: 1,
    name: "Biryani",
    image:
      "https://b.zmtcdn.com/data/dish_images/d19a31d42d5913ff129cafd7cec772f81639737697.png",
  },
  {
    id: 2,
    name: "Pizza",
    image:
      "https://b.zmtcdn.com/data/o2_assets/d0bd7c9405ac87f6aa65e31fe55800941632716575.png",
  },
  {
    id: 3,
    name: "Burger",
    image:
      "https://b.zmtcdn.com/data/dish_images/ccb7dc2ba2b054419f805da7f05704471634886169.png",
  },
  {
    id: 4,
    name: "Thali",
    image:
      "https://b.zmtcdn.com/data/o2_assets/52eb9796bb9bcf0eba64c643349e97211634401116.png",
  },
  {
    id: 5,
    name: "Momos",
    image:
      "https://b.zmtcdn.com/data/o2_assets/5dbdb72a48cf3192830232f6853735301632716604.png",
  },
  {
    id: 6,
    name: "Chinese",
    image:
      "https://b.zmtcdn.com/data/o2_assets/e444ade83eb22360b6ca79e6e777955f1632716661.png",
  },
  {
    id: 7,
    name: "South Indian",
    image:
      "https://b.zmtcdn.com/data/o2_assets/7e83ad932f340bacd71bd7e891ede6541632716696.png",
  },
  {
    id: 8,
    name: "Desserts",
    image:
      "https://b.zmtcdn.com/data/o2_assets/9694b563c793ea7bddf49f619dd4b7751632716697.png",
  },
  {
    id: 9,
    name: "Snacks",
    image:
      "https://b.zmtcdn.com/data/o2_assets/2b5a5b533473aada22015966f668e30e1633434990.png",
  },
  {
    id: 10,
    name: "Ice Cream",
    image:
      "https://b.zmtcdn.com/data/o2_assets/c21624eac87ed1c8c87ef1ea52980ded1632716659.png",
  },
  {
    id: 11,
    name: "Shakes",
    image:
      "https://b.zmtcdn.com/data/o2_assets/8ecc1badfadb87d719cfdab91e246fcf1632716605.png",
  },
  {
    id: 12,
    name: "Rolls",
    image:
      "https://b.zmtcdn.com/data/dish_images/aebeb69b0a3604919c9027497e866e211634771655.png",
  },
];

const CategoryList = () => {
  const navigate = useNavigate();

  // Get city name from localStorage or fallback to 'bhimtal'
  const city = localStorage.getItem("userCity") || "bhimtal";

  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check whether to show left/right scroll arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
  };

  // Scroll category container left or right
  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = window.innerWidth < 768 ? 150 : 200;
    scrollContainerRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // Handle click on a category card
  const handleCategoryClick = (category) => {
    setActiveCategory(category.id);

    const formattedCity = city.toLowerCase().replace(/\s+/g, "-");
    const formattedCategory = category.name.toLowerCase().replace(/\s+/g, "-");

    // Navigate to route like /nainital/pizza or /bhimtal/momos
    navigate(`/${formattedCity}/${formattedCategory}`);
  };

  // Initialize scroll listeners on mount
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", checkScrollPosition);
    return () => container?.removeEventListener("scroll", checkScrollPosition);
  }, []);

  return (
    <section className="px-4 py-8 bg-white relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          What's on your mind?
        </h2>

        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100"
            aria-label="Scroll left">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100"
            aria-label="Scroll right">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Horizontal Scrollable Category List */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide"
            onScroll={checkScrollPosition}
            role="list">
            <div className="flex space-x-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex flex-col items-center flex-shrink-0 w-24 cursor-pointer transition-all duration-300 ${
                    activeCategory === category.id ? "scale-110" : ""
                  }`}
                  role="listitem">
                  <div
                    className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                      activeCategory === category.id
                        ? "border-orange-500 shadow-xl"
                        : "border-gray-100 shadow-md"
                    }`}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      activeCategory === category.id
                        ? "text-orange-600 font-bold"
                        : "text-gray-700"
                    }`}>
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Bottom Page Indicator Dots */}
          <div className="flex justify-center mt-4 space-x-1">
            {categories.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  Math.floor(activeCategory / 3) === Math.floor(index / 3)
                    ? "w-4 bg-orange-500"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
