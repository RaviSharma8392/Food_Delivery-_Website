import React from "react";
import {
  FiHome,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiYoutube,
  FiLinkedin,
} from "react-icons/fi";
import { FaGooglePlay, FaAppStore } from "react-icons/fa";

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
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  Press
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
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  Help & Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  Partner with us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-orange-600">
                  Ride with us
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
                  Cookie Policy
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
              WE DELIVER TO
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              {[
                "Nainital",
                "Bhimtal",
                "Bhowali",
                "Haldwani",
                "Kathgodam",
                "Sattal",
                "Naukuchiatal",
                "Ramgarh",
              ].map((city) => (
                <li key={city}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-orange-600">
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section - Social & App Download */}
        <div className="md:flex md:items-center md:justify-between">
          {/* Social Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-orange-600">
              <FiInstagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-600">
              <FiFacebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-600">
              <FiTwitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-600">
              <FiYoutube className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-600">
              <FiLinkedin className="h-5 w-5" />
            </a>
          </div>

          {/* App Download Buttons */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="flex items-center bg-black text-white px-3 py-2 rounded text-sm font-medium">
              <FaGooglePlay className="mr-2" />
              Google Play
            </a>
            <a
              href="#"
              className="flex items-center bg-black text-white px-3 py-2 rounded text-sm font-medium">
              <FaAppStore className="mr-2" />
              App Store
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center md:text-left">
          <p className="text-xs text-gray-500">
            © 2023 CraveEats Technologies Pvt. Ltd. All rights reserved.
          </p>
        </div>
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
    </footer>
  );
};

export default Footer;
