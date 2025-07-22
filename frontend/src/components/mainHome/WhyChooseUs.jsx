import React from "react";
import { FiClock, FiHeart, FiAward, FiCheckCircle } from "react-icons/fi";

const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Lightning Fast Delivery",
      description: "Get your food delivered in under 30 minutes or get it free",
      icon: <FiClock className="w-8 h-8 text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      title: "Local Favorites",
      description: "Handpicked menus from Nainital's best restaurants & chefs",
      icon: <FiHeart className="w-8 h-8 text-red-500" />,
      bg: "bg-red-50",
    },
    {
      title: "Top-rated Service",
      description: "10,000+ happy customers across the Nainital region",
      icon: <FiAward className="w-8 h-8 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      title: "Quality Guaranteed",
      description: "Fresh ingredients and hygienic packaging every time",
      icon: <FiCheckCircle className="w-8 h-8 text-green-500" />,
      bg: "bg-green-50",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose <span className="text-orange-500">CraveEats</span>?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            We're not just delivering food, we're delivering experiences
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div
                className={`${item.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Still not convinced?
              </h3>
              <p className="text-gray-600 mb-4">
                Try us risk-free with our 100% satisfaction guarantee
              </p>
              <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-300">
                Download Our App
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gray-100 rounded-lg p-4 w-full max-w-xs">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <FiCheckCircle className="text-orange-500" />
                  </div>
                  <span>No delivery fee on first order</span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <FiCheckCircle className="text-orange-500" />
                  </div>
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <FiCheckCircle className="text-orange-500" />
                  </div>
                  <span>Easy cancellation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
