import React from "react";
import { FiSearch, FiShoppingBag, FiClock, FiTruck } from "react-icons/fi";

const HowItWorks = () => {
  const steps = [
    {
      title: "Browse Restaurants",
      desc: "Explore local favorites and trending spots near you",
      icon: <FiSearch className="w-8 h-8" />,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Choose Your Meal",
      desc: "Pick your favorite dishes and customize your order",
      icon: <FiShoppingBag className="w-8 h-8" />,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "Fast Delivery",
      desc: "Get your order delivered fresh and hot to your doorstep",
      icon: <FiTruck className="w-8 h-8" />,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
    {
      title: "Enjoy Your Meal",
      desc: "Savor delicious food in under 30 minutes",
      icon: <FiClock className="w-8 h-8" />,
      bg: "bg-green-50",
      color: "text-green-600",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How Food<span className="text-orange-500">Ease</span> Works
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Get your favorite food delivered in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group pt-16 pb-12 px-6 text-center rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div
                  className={`flex items-center justify-center w-16 h-16 ${step.bg} rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className={step.color}>{step.icon}</span>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Download App Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
