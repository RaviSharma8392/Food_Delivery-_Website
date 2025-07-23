// src/api/orderApi.js

import axios from 'axios';

// Base API URL from environment variables
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;

/**
 * Generate axios config with Authorization header
 * @param {string} token - Bearer token
 * @returns {Object} Axios config
 */
const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/**
 * Create a new order
 * @param {Object} orderData - Order payload
 * @param {string} token - User token
 * @returns {Promise<Object>} Created order
 */
const createOrder = async (orderData, token) => {
  const response = await axios.post(API_URL, orderData, authConfig(token));
  return response.data;
};

/**
 * Get the current user's orders
 * @param {string} token - User token
 * @returns {Promise<Array>} List of orders
 */
const getMyOrders = async (token) => {
  const response = await axios.get(`${API_URL}/myorders`, authConfig(token));
  return response.data;
};

/**
 * Get orders for a specific restaurant (with optional status filter)
 * @param {string} restaurantId - Restaurant ID
 * @param {string} status - Order status filter (e.g., "pending", "completed")
 * @param {string} token - Admin/restaurant token
 * @returns {Promise<Array>} List of orders
 */
const getRestaurantOrders = async (restaurantId, status, token) => {
  const config = {
    ...authConfig(token),
    params: { restaurantId, status },
  };

  const response = await axios.get(`${API_URL}/restaurant/${restaurantId}`, config);
  return response.data;
};

/**
 * Update the status of an order
 * @param {string} orderId - Order ID
 * @param {string} status - New order status
 * @param {string} token - Admin or delivery partner token
 * @returns {Promise<Object>} Updated order
 */
const updateOrderStatus = async (orderId, status, token) => {
  const response = await axios.put(
    `${API_URL}/${orderId}/status`,
    { status },
    authConfig(token)
  );
  return response.data;
};

// Export as a grouped object
const orderApi = {
  createOrder,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
};

export default orderApi;
