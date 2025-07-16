import React from "react";
import { Link } from "react-router-dom";

const UserDropdown = ({ user, handleLogout, isMobile }) => {
  return (
    <div
      className={`absolute ${
        isMobile ? "top-16 right-0.5 w-60 " : "top-12 right-0 w-64"
      } rounded-xl shadow-xl bg-white ring-1 ring-gray-200 z-50`}>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User"
            className="w-8 h-8 rounded-full object-cover mr-3"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-medium text-sm mr-3">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      <Link
        to="/user/history"
        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
        📦 My Orders
      </Link>

      <Link
        to="/user/account"
        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
        ⚙️ Account Settings
      </Link>

      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100">
        🚪 Sign Out
      </button>
    </div>
  );
};

export default UserDropdown;
