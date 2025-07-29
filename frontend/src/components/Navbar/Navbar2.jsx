import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoRestaurantOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useCartContext } from "../../context/cartContext"; // adjust path if needed

const Navbar2 = ({ isLoggedIn }) => {
  const { cart } = useCartContext();

  const itemCount = cart?.length || 0;

  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate("/user/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* Header */}
      <header
        className={`bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-between fixed w-full top-0 z-40 px-4 md:px-8 lg:px-16 xl:px-20 border-b border-orange-100 transition-all duration-300 ${
          scrolled ? "h-16 shadow-md" : "h-20 shadow-sm"
        }`}>
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Home">
          <IoRestaurantOutline className="text-2xl sm:text-3xl text-orange-600 group-hover:rotate-12 transition-transform" />
          <span className="text-xl sm:text-2xl font-bold text-orange-800 group-hover:text-orange-600 transition-colors">
            MUNCHIZO
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center ml-8">
          <div className="flex gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center px-2 lg:px-3 py-1 text-orange-800 hover:text-amber-600 font-medium transition-colors text-sm lg:text-base">
                {link.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Account + Cart Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Profile/Login */}
          <NavLink
            to="/cart"
            className="relative flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all rounded-full">
            <FaShoppingCart className="text-base" />
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </NavLink>
          <button
            onClick={handleAccountClick}
            className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all rounded-full"
            aria-label={isLoggedIn ? "Profile" : "Login"}>
            {isLoggedIn ? "Profile" : "Sign In"}
          </button>
        </div>

        {/* Account Button (Mobile) */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={handleAccountClick}
            className="text-orange-700 p-2 rounded-full hover:bg-orange-100 transition-all"
            aria-label={isLoggedIn ? "Profile" : "Login"}>
            <FaUser className="text-2xl" />
          </button>
        </div>
      </header>

      {/* Top space for fixed header */}
      <div className={`pt-${scrolled ? "20" : "24"}`} />
    </>
  );
};

export default Navbar2;
