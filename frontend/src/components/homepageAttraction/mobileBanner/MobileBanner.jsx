import React, { useState } from "react";
import { FiSearch, FiStar, FiMapPin, FiChevronRight } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const MobileHeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className=" md:hidden relative bg-gradient-to-br from-[#fff8f1] to-[#ffefe2] text-gray-900 pt-6 pb-8 px-4">
      <Helmet>
        <title>Delicious Food Delivery | CraveEats</title>
        <meta
          name="description"
          content="Get food delivered quickly from the best local restaurants in Kumaon."
        />
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
          New in Kumaon
        </span>
      </div>

      {/* Always Visible Search Input */}
      <div className="relative mb-5">
        <FiSearch className="absolute left-4 top-3 text-orange-500 text-lg" />

        {/* Just click input to redirect */}
        <input
          type="text"
          placeholder="Search Momos, Thukpa, Pizza..."
          onClick={() => navigate("/search")}
          className="w-full py-3 pl-12 pr-20 rounded-full shadow border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm cursor-pointer"
          readOnly // Optional: prevents typing, making it a "click to search" field
        />

        <button
          onClick={() => navigate("/search")}
          className="absolute right-4 top-2.5 text-white bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold">
          Search
        </button>
      </div>

      {/* Tagline */}
      <div className="flex items-center justify-between mb-6">
        <div className="max-w-[65%]">
          <h1 className="text-xl font-bold text-gray-800 leading-snug">
            Fast Food Delivery in Kumaon
          </h1>
          <p className="text-sm text-gray-600">
            From Naini’s shores to your home
          </p>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
          alt="Delivery"
          className="w-20 h-20 object-contain animate-float"
        />
      </div>

      {/* Coupon Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            code: "FIRSTORDER",
            offer: "50% OFF up to ₹100",
            icon: "https://img.icons8.com/color/48/discount.png",
          },
          {
            code: "NEWUSER",
            offer: "20% OFF all orders",
            icon: "https://img.icons8.com/emoji/48/hamburger-emoji.png",
          },
          {
            code: "TRYNEW",
            offer: "Free dessert",
            icon: "https://img.icons8.com/color/48/cupcake.png",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm p-2 text-center border border-orange-100">
            <img src={item.icon} alt="icon" className="mx-auto mb-1 w-8 h-8" />
            <p className="text-xs font-bold text-orange-600">{item.code}</p>
            <p className="text-[10px] text-gray-500">{item.offer}</p>
          </div>
        ))}
      </div>

      {/* Location */}
      <div className="bg-white/80 backdrop-blur-md py-2 px-3 rounded-full shadow-sm flex items-center justify-between mb-5">
        <div className="flex items-center">
          <FiMapPin className="text-orange-500 mr-2 text-sm" />
          <span className="text-xs font-medium">
            Nainital, Bhimtal, Bhowali
          </span>
        </div>
        <FiChevronRight className="text-gray-500 text-sm" />
      </div>

      {/* Rating Badge */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-xl shadow-sm border border-orange-100 flex items-center">
        <div className="bg-green-100 p-1 rounded-full mr-2">
          <FiStar className="text-green-600 text-xs" />
        </div>
        <div>
          <p className="text-[10px] text-gray-500">Avg Rating</p>
          <p className="text-xs font-bold text-green-600">4.8 ★</p>
        </div>
      </div>
    </section>
  );
};

export default MobileHeroBanner;
