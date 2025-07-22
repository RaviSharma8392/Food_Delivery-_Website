import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiClock, FiHelpCircle } from "react-icons/fi";

const CTA = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 border-t border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore <span className="text-gray-800">Nainital's Finest</span>{" "}
            Restaurants
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated selection of the city's top dining experiences
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link
            to="/restaurants"
            className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-md transition hover:shadow-md">
            <FiMapPin className="mr-2" />
            View All Restaurants
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-md mx-auto">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <FiClock className="text-gray-600 text-lg" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Average delivery</p>
              <p className="font-medium text-gray-900">30-45 minutes</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <FiHelpCircle className="text-gray-600 text-lg" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Need help?</p>
              <p className="font-medium text-gray-900">Contact support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
