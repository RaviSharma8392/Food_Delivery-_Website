import React from "react";
import useUserContext from "../../context/UserContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiEdit,
  FiBox,
  FiArrowLeft,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import "./MyAccount.css";

export default function MyAccount() {
  const navigate = useNavigate();
  const { user, loading, logout } = useUserContext();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2 className="error-title">Access Required</h2>
        <p className="error-message">
          Please sign in to view your account details.
        </p>
        <button
          className="login-redirect-btn"
          onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="account-container">
      {/* Back/Home Button */}
      <button className="home-button" onClick={() => navigate("/")}>
        <FiArrowLeft size={18} />
        <span>Home</span>
      </button>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-container">
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="default-avatar">
              <FiUser size={40} />
            </div>
          )}
          <button className="edit-profile-btn">
            <FiEdit size={16} /> Edit
          </button>
        </div>
        <h1 className="profile-name">{user.user.name}</h1>
        <p className="profile-email">{user.user.email}</p>
      </div>

      {/* Profile Details */}
      <div className="profile-details">
        <div className="detail-card">
          <div className="detail-icon">
            <FiMail size={20} />
          </div>
          <div className="detail-content">
            <h3 className="detail-label">Email Address</h3>
            <p className="detail-value">{user.user.email}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FiPhone size={20} />
          </div>
          <div className="detail-content">
            <h3 className="detail-label">Phone Number</h3>
            <p className="detail-value">
              {user.user.phoneNumber || "Not provided"}
              {!user.user.phoneNumber && (
                <button className="add-info-btn">Add phone</button>
              )}
            </p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FiHome size={20} />
          </div>
          <div className="detail-content">
            <h3 className="detail-label">Delivery Address</h3>
            <p className="detail-value">
              {user.user.address || "No address saved"}
              {!user.user.address && (
                <button className="add-info-btn">Add address</button>
              )}
            </p>
          </div>
        </div>

        <div className="detail-card highlight-card">
          <div className="detail-icon highlight-icon">
            <FiBox size={20} />
          </div>
          <div className="detail-content">
            <h3 className="detail-label">Food Items</h3>
            <p className="detail-value">
              View your saved or ordered food items
            </p>
            <NavLink to="/user/food-items" className="view-items-btn">
              View Items
            </NavLink>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="profile-actions">
        <NavLink to="/user/history" className="action-btn primary">
          Order History
        </NavLink>
        <button className="action-btn secondary">Change Password</button>
        <button onClick={handleLogout} className="action-btn logout">
          Sign Out
        </button>
      </div>
    </div>
  );
}
