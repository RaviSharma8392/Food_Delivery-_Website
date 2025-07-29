import React from "react";
import {
  FiHome,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiInstagram,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-8 pb-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              COMPANY
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              CONTACT
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@craveeats.com"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  support@craveeats.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917417408974"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  +91 7417408974
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">LEGAL</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              CONNECT WITH US
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/munchizo_bhimtal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-600">
                <FiInstagram className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Follow us for updates and offers
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section - Copyright */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Munchizo All rights reserved.
          </p>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 flex justify-around items-center md:hidden">
          <a href="#" className="flex flex-col items-center text-orange-600">
            <FiHome className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
          <a href="#" className="flex flex-col items-center text-gray-500">
            <FiSearch className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </a>
          <a href="#" className="flex flex-col items-center text-gray-500">
            <FiShoppingBag className="h-5 w-5" />
            <span className="text-xs mt-1">Orders</span>
          </a>
          <a href="#" className="flex flex-col items-center text-gray-500">
            <FiUser className="h-5 w-5" />
            <span className="text-xs mt-1">Account</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
