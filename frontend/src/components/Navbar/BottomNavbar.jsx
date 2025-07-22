import React from "react";
import {
  FaShoppingCart,
  FaLeaf,
  FaHome,
  FaStore,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCartContext } from "../../context/cartContext"; // 🔁 Adjust path as needed

const NavbarFooter = () => {
  const { total_item } = useCartContext(); // 🔁 Access cart item count

  return (
    <>
      {/* Bottom padding to prevent content from being hidden behind fixed footer */}
      <div className="pb-16"></div>

      {/* Fixed Footer Navbar */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Home Button */}
            <Link
              to="/"
              className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-500 transition-colors flex-1">
              <FaHome className="text-xl" />
              <span className="text-xs mt-1">Home</span>
            </Link>

            {/* Search Button */}
            <Link
              to="/search"
              className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-500 transition-colors flex-1">
              <FaSearch className="text-xl" />
              <span className="text-xs mt-1">Search</span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-500 transition-colors flex-1 relative">
              <div className="relative">
                <FaShoppingCart className="text-xl" />
                {total_item > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {total_item}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">Cart</span>
            </Link>

            {/* Local Products Button */}
            <Link
              to="/local-products"
              className="flex flex-col items-center justify-center text-gray-600 hover:text-amber-700 transition-colors flex-1">
              <FaStore className="text-xl" />
              <span className="text-xs mt-1">Local</span>
            </Link>

            {/* Vegan Option Button */}
            <Link
              to="/vegan"
              className="flex flex-col items-center justify-center text-gray-600 hover:text-green-600 transition-colors flex-1">
              <FaLeaf className="text-xl" />
              <span className="text-xs mt-1">Vegan</span>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default NavbarFooter;
