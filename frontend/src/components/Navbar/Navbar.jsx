import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/cartContext";
import useUser from "../../context/UserContext";
import { IoRestaurantOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import UserDropdown from "./UserDropdown";
import useIsMobile from "../../hooks/UseIsMobile";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setToken, logout } = useUser();
  const isMobile = useIsMobile();
  const dropdownRef = useRef(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserDropdown(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg border-b border-orange-100"
          : "bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm"
      }`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <IoRestaurantOutline className="text-3xl text-orange-600 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-bold text-orange-800 group-hover:text-orange-600 transition-colors">
              Savory<span className="text-amber-500">Bites</span>
            </span>
          </Link>

          {/* Navigation links - Desktop only */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1 text-sm font-semibold transition-colors group ${
                  location.pathname === link.path
                    ? "text-amber-600"
                    : "text-orange-800 hover:text-amber-600"
                }`}>
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-amber-500 transition-all duration-300 ${
                    location.pathname === link.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:flex items-center px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-full shadow-md hover:shadow-lg transition-all">
                Sign In
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center text-sm rounded-full">
                  {user.user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User"
                      className="h-8 w-8 rounded-full border-2 border-amber-200 object-cover hover:border-amber-300 transition"
                    />
                  ) : (
                    <FaUserCircle className="h-8 w-8 text-orange-700 hover:text-amber-600 transition" />
                  )}
                </button>
                {userDropdown && (
                  <UserDropdown
                    user={user.user}
                    handleLogout={handleLogout}
                    isMobile={isMobile}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
