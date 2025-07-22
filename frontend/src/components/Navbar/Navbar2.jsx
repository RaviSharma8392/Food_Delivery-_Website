import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoRestaurantOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser, FaLeaf } from "react-icons/fa";

const Navbar2 = ({ isLoggedIn }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    { name: "Menu", path: "/menu" },
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
      {/* Main Header */}
      <header
        className={`bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-between fixed w-full top-0 z-50 px-4 md:px-8 lg:px-16 xl:px-20 border-b border-orange-100 transition-all duration-300 ${
          scrolled ? "h-16 shadow-md" : "h-20 shadow-sm"
        }`}>
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="Home">
            <IoRestaurantOutline className="text-2xl sm:text-3xl text-orange-600 group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-orange-800 group-hover:text-orange-600 transition-colors">
                Savory<span className="text-amber-500">Bites</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile Account Button - Only shown on mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={handleAccountClick}
            className="text-orange-700 p-2 rounded-full hover:bg-orange-100 transition-all"
            aria-label={isLoggedIn ? "Profile" : "Login"}>
            <FaUser className="text-2xl" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center ml-8">
          <nav className="flex gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center px-2 lg:px-3 py-1 text-orange-800 hover:text-amber-600 font-medium transition-colors text-sm lg:text-base">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Account Button */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <button
            onClick={handleAccountClick}
            className="flex items-center px-4 lg:px-5 py-1.5 lg:py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all rounded-full"
            aria-label={isLoggedIn ? "Profile" : "Login"}>
            {isLoggedIn ? "Profile" : "Sign In"}
          </button>
        </div>
      </header>

      {/* Bottom padding for all content to account for fixed header */}
      <div className={`pt-10 ${scrolled ? "pt-8" : ""}`}></div>
    </>
  );
};

export default Navbar2;
