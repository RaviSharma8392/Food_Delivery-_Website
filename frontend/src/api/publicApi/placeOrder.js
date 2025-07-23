// src/api/placeOrderApi.js

import axios from "axios";

// Base URL from .env, fallback provided for development
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://munchiza.onrender.com";

/**
 * Place an order
 * @param {Object} orderData - The order payload
 * @param {string} token - Auth token for the user
 * @returns {Promise<Object>} Axios response
 */
const placeOrderAPI = async (orderData, token) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/public/placeorder`,
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.data)
  return response.data;
};

export default placeOrderAPI;
