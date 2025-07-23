import React from "react";
import { NavLink } from "react-router-dom";

import useUserContext from "../../context/UserContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiBox,
  FiArrowLeft,
  FiClock,
  FiHeart,
  FiCreditCard,
} from "react-icons/fi";

export default function MyAccount() {
  const { user, loading, logout } = useUserContext();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-50 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-50 bg-white p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your account details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen mt-10 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <h1 className="text-xl font-bold text-gray-800">My Account</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white px-6 py-8">
        <div className="flex items-center">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAV1BMVEX6+vqPj4////+Li4u5ubn8/PyIiIiFhYWJiYnk5OShoaGnp6fT09Pn5+eRkZHu7u7Z2dn19fXCwsKamprHx8exsbHOzs7X19eurq6/v7+jo6Pe3t6WlpZaNtXmAAAE3UlEQVR4nO2d25aqOhBFsUIRbgqI4AX//zsP0fa0vUfbBoKm4ljzpfvROapIIGSFKAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIEWamG+P/vn/Owhi5Juu3XZHnp6Lblutm1PT9q5aDKRriVulEqZVBqUSr9pjxh0gyrWOlr273KL05Vh/gyDTkv+jdJIsscEemrNUP9K7oU0W+f6UD1Bz+9rs4xuEOrFSrR/15T7rJwiwjU/y8gF9l3IWoyHxKLAVHxS68AYej1qZDbyRFaIocbaYIjhNHHlajTqygIS2CUqRiquDYqHFAinS0H2S+0WUwijzYThP/KFahjDY8vUWvtIEUkeK5hkkYMz9X83rUoJsQ+pTy2YIrFcJ4ytn8EoZRRCocBEMoostVeFH0LfAUOs4dSK8kpfQ2pbOT4Gp1Et6mvHZr0vEOXPhYQ7vU0TCphRueHAXFj6bsKij95pSrOY9N/xQxktymPLgbJqKfobh3HWhGw0GyIW3d5vuLoeg5f/6j4TdpL9qwczdUoh+DYWhDuhPdpY5PFhdD2dfhboGxdC/ZkMsFZvxMtOH64+9pGnfDjWTBBR7xxT/ku08XqejpcGzTvWub6rXsLnW/EIVfhu7LGNIXMdxnRC16NjRw5FZD2as0F9xuTWU//l7hxmVNeCO/hKaI89dqdAAljBxe4wdxFRp4P7dPpc/2/zNnv5AhFT8X3uBonuE5FMG57/IT4e/VfkDldEU9hFPCyCx+T1XU+6AEzaw4TVH3gQmaZbcpisFV0DDlWkzD3K1Pa8ud0EnbBClotut3NmXUx9B2sd9B2fmZo86DjgVFTOXmr4d+fa4DLuAV4rJ9EF5TOg/fz2ACiBud/rRUiT5vPyF+eIWJ1v3hnGidGMY/566sPione00CR1U21HU9rCs2YWffP+kV8A3fPwQAAIAP7k/1WApJkwpTM/THeFmOfRYJuelhGgo13nYuTaJX3VqCI1W5awDhIUof/K+hzlkZneKY+F7Bmb4uOhXPq3DUv1rQ85t916CaHcrjtegSF51gePDWp1y/o4Q+X5y+p4RjETtPRVxiq6UlnmrovkvPFl9tusS2dTt87SNaInpgh68IBh3eJLhSWxjCcK7h265DX4afP9IsEDa0w1cUaomQkx2+olBLhJwsDT09IrqfEGFt6CkKxY17cNsOb3ujqX2Tobfj+N41mCbeUqVzT56bis+T6t4i6HN/+3va1Gde7z3zhdfd0e4H7jzHb5rN7fg5OzwfUjc3WmGPOvp9NeOW47Iy9P16jXavvf3W/o/+ovyVfeptufsO19Do34IiwmxLnO/1EP8vuQ30sttTJeWIjFcpihE0W/Jf0KhqI0fQbDmZeIz+c9JWxjV4g7lYtlN1LGGz0A+of/jBnOkoJTGMSM1iZdSdzNMhmYbzEiOObkVsZ/sVpv7PDJCdn+wcDfH+UQbIhiByQkzZQc8qpEqSWG5/3sMUlYVOJn5nRieHOpxPzfEoWXcbW0uT8oqHcPS+GH9wVXZ33wT81c18JzCP96F+DfGS5lrvt4d8oy65tTS9bJZOr/k1dc67XV1Foae8Lrv4uamqoS77frfd7nZ9X9ZZ1TQsbEe+E1+Zte+gARJsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJP/AAFSQ7wNy+LTAAAAAElFTkSuQmCC"
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-orange-100 object-cover"
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-800">
              {user.user.name}
            </h2>
            <p className="text-gray-600">{user.user.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 mb-6">
          <NavLink
            to="/user/history"
            className="flex flex-col items-center hover:text-orange-500 transition-colors">
            <div className="bg-orange-100 p-3 rounded-full mb-1 hover:bg-orange-200 transition-colors">
              <FiClock size={18} className="text-orange-500" />
            </div>
            <span className="text-xs text-gray-700 hover:text-orange-500">
              Orders
            </span>
          </NavLink>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-1">
              <FiHeart size={18} className="text-red-500" />
            </div>
            <span className="text-xs text-gray-700">Favorites</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-1">
              <FiHome size={18} className="text-blue-500" />
            </div>
            <span className="text-xs text-gray-700">Addresses</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-1">
              <FiCreditCard size={18} className="text-green-500" />
            </div>
            <span className="text-xs text-gray-700">Payments</span>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
          <div className="p-4 border-b border-gray-100 font-bold text-gray-800">
            Account Details
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex items-center">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <FiMail size={18} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user.user.email}</p>
              </div>
            </div>
            <div className="p-4 flex items-center">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <FiPhone size={18} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">
                  {user.user.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Saved Addresses</h3>
          </div>
          <div className="p-4">
            {user.user.address ? (
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <FiHome size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium mb-1 text-gray-800">Home</p>
                  <p className="text-gray-600 text-sm">{user.user.address}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No saved addresses</p>
              </div>
            )}
          </div>
        </div>

        {/* Food Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
          <div className="p-4 border-b border-gray-100 font-bold text-gray-800">
            Food Preferences
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between py-3 text-gray-800">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FiBox size={16} className="text-orange-500" />
                </div>
                <span>Saved Food Items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={logout}
          className="w-full bg-white border border-gray-300 text-red-500 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}
