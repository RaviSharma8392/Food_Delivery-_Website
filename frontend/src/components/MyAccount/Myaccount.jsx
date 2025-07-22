import React, { useState } from "react";
import useUserContext from "../../context/UserContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiEdit,
  FiBox,
  FiArrowLeft,
  FiClock,
  FiHeart,
  FiCreditCard,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

// Avatar options
const avatarOptions = [
  {
    id: 1,
    url: "https://xsgames.co/randomusers/assets/avatars/male/1.jpg",
    label: "Male 1",
  },
  {
    id: 2,
    url: "https://xsgames.co/randomusers/assets/avatars/male/2.jpg",
    label: "Male 2",
  },
  {
    id: 3,
    url: "https://xsgames.co/randomusers/assets/avatars/male/3.jpg",
    label: "Male 3",
  },
  {
    id: 4,
    url: "https://xsgames.co/randomusers/assets/avatars/female/1.jpg",
    label: "Female 1",
  },
  {
    id: 5,
    url: "https://xsgames.co/randomusers/assets/avatars/female/2.jpg",
    label: "Female 2",
  },
  {
    id: 6,
    url: "https://xsgames.co/randomusers/assets/avatars/female/3.jpg",
    label: "Female 3",
  },
  {
    id: 7,
    url: "https://xsgames.co/randomusers/assets/avatars/pixel/1.jpg",
    label: "Pixel 1",
  },
  {
    id: 8,
    url: "https://xsgames.co/randomusers/assets/avatars/pixel/2.jpg",
    label: "Pixel 2",
  },
];

export default function MyAccount() {
  const navigate = useNavigate();
  const { user, loading, logout, updateUser } = useUserContext();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatar || avatarOptions[0].url
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAvatarChange = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setShowAvatarPicker(false);
    // Update avatar in backend
    updateUser({ avatar: avatarUrl });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-50  bg-white">
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
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen mt-10 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-gray-100 mr-2">
            <FiArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">My Account</h1>
        </div>
      </div>

      {/* Profile Section with Avatar Picker */}
      <div className="bg-white px-6 py-8 relative">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={selectedAvatar}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-orange-100 object-cover"
              onError={(e) => {
                e.target.src = avatarOptions[0].url;
              }}
            />
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <FiEdit size={14} className="text-orange-500" />
            </button>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-800">
              {user.user.name}
            </h2>
            <p className="text-gray-600">{user.user.email}</p>
          </div>
        </div>

        {/* Avatar Picker Dropdown */}
        {showAvatarPicker && (
          <div className="absolute left-6 top-24 z-20 bg-white rounded-lg shadow-lg border border-gray-200 w-64 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800">Choose Avatar</h3>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="text-gray-400 hover:text-gray-600">
                <FiX size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {avatarOptions.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => handleAvatarChange(avatar.url)}
                  className={`cursor-pointer p-1 rounded-full transition-all ${
                    selectedAvatar === avatar.url
                      ? "ring-2 ring-orange-500"
                      : "hover:bg-gray-100"
                  }`}>
                  <img
                    src={avatar.url}
                    alt={avatar.label}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 mb-6">
          <NavLink
            to="/user/history"
            className="bg-white rounded-lg p-3 shadow-xs text-center hover:shadow-sm transition-all border border-gray-100 hover:border-orange-200">
            <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiClock size={18} className="text-orange-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">Orders</span>
          </NavLink>

          <NavLink
            to="/user/favorites"
            className="bg-white rounded-lg p-3 shadow-xs text-center hover:shadow-sm transition-all border border-gray-100 hover:border-orange-200">
            <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiHeart size={18} className="text-red-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">Favorites</span>
          </NavLink>

          <NavLink
            to="/user/addresses"
            className="bg-white rounded-lg p-3 shadow-xs text-center hover:shadow-sm transition-all border border-gray-100 hover:border-orange-200">
            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiHome size={18} className="text-blue-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">Addresses</span>
          </NavLink>

          <NavLink
            to="/user/payments"
            className="bg-white rounded-lg p-3 shadow-xs text-center hover:shadow-sm transition-all border border-gray-100 hover:border-orange-200">
            <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiCreditCard size={18} className="text-green-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">Payments</span>
          </NavLink>
        </div>
      </div>

      {/* Account Details */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xs overflow-hidden mb-4 border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Account Details</h3>
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
                  {user.user.phoneNumber || (
                    <button className="text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors">
                      Add phone number
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-xl shadow-xs overflow-hidden mb-4 border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Saved Addresses</h3>
            <button className="text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors">
              Add New
            </button>
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
        <div className="bg-white rounded-xl shadow-xs overflow-hidden mb-4 border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Food Preferences</h3>
          </div>

          <div className="p-4">
            <NavLink
              to="/user/food-items"
              className="flex items-center justify-between py-3 text-gray-800 hover:text-orange-500 transition-colors">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FiBox size={16} className="text-orange-500" />
                </div>
                <span>Saved Food Items</span>
              </div>
              <span className="text-gray-400">→</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-gray-300 text-red-500 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Sign Out
        </button>
      </div>

      {/* Overlay for avatar picker */}
      {showAvatarPicker && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowAvatarPicker(false)}
        />
      )}
    </div>
  );
}
