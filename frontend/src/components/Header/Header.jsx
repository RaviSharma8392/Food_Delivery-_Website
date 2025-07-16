import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      title: "Seasonal Ingredients",
      subtitle: "Fresh flavors that change with the seasons",
    },
    {
      image:
        "https://i0.wp.com/www.designlike.com/wp-content/uploads/2018/03/restaurant-1948732_1920.jpg",
      title: "Artful Presentation",
      subtitle: "Every dish is a masterpiece",
    },
    // {
    //   image:
    //     "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1981&q=80",
    //   title: "Unforgettable Flavors",
    //   subtitle: "Taste the difference of culinary excellence",
    // },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative h-screen overflow-hidden">
      {/* Slideshow */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}>
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 sm:px-12 lg:px-24 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4">
          {slides[currentSlide].title}
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {slides[currentSlide].subtitle}
        </p>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-amber-500 w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
