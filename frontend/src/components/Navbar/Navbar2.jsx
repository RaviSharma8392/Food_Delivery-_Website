import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoRestaurantOutline, IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar2 = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-between shadow-md fixed w-full h-20 top-0 z-50 px-4 md:px-8 lg:px-20 border-b border-orange-100">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-orange-700 p-2 rounded-full hover:bg-orange-100 transition-all">
          {mobileOpen ? (
            <IoClose className="text-2xl" />
          ) : (
            <GiHamburgerMenu className="text-2xl" />
          )}
        </button>
      </div>

      {/* Logo */}
      <div className="flex-1 md:flex-none">
        <Link to="/" className="flex items-center gap-2 group">
          <IoRestaurantOutline className="text-3xl text-orange-600 group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold text-orange-800 group-hover:text-orange-600 transition-colors">
            Savory<span className="text-amber-500">Bites</span>
          </span>
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex flex-1 justify-center">
        <nav className="flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative px-3 py-1 text-sm font-semibold text-orange-900 hover:text-amber-600 transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sign In button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLoginRedirect}
          className="hidden md:flex items-center px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all rounded-full">
          Sign In
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-20 left-0 right-0 bg-gradient-to-b from-orange-50 to-amber-50 shadow-lg md:hidden border-t border-orange-200">
          <nav className="flex flex-col p-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="py-3 px-4 text-orange-800 hover:text-amber-600 hover:bg-orange-100 rounded-md transition-colors font-medium"
                onClick={() => setMobileOpen(false)}>
                {link.name}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-orange-200">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLoginRedirect();
                }}
                className="w-full px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg shadow-md transition-all">
                Sign In
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar2;
