// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Oops! Page not found.</p>
      <button className="home-button" onClick={() => navigate("/")}>
        Go Back Home
      </button>
    </div>
  );
}
