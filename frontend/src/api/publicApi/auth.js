// src/api/authApi.js

import axios from "axios";

// Base URL from environment variables
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth`;

// Create a custom Axios instance for auth
const authAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Login user with email or phone and password
 * @param {Object} credentials - { emailOrPhone, password }
 * @returns {Promise<Object>} Auth data including token and user info
 */
export const loginUser = async (credentials) => {
  const response = await authAPI.post("/login", credentials);
  return response.data;
};

/**
 * Signup (register) a new user
 * @param {Object} userData - { name, emailOrPhone, password, ... }
 * @returns {Promise<Object>} Signup result with success flag and data or error message
 */
export const signupUser = async (userData) => {
  try {
    const response = await authAPI.post("/createuser", userData);
    return {
      success: true,
      authToken: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    console.error("Signup error:", error.response || error);
    return {
      success: false,
      message: error.response?.data?.message || "Signup failed. Please try again.",
    };
  }
};
