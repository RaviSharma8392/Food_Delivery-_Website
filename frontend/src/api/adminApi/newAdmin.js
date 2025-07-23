// src/api/restaurantAdminApi.js

import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/admin`;

/**
 * Axios config generator for auth headers
 * @param {string} token - Bearer token
 * @returns {Object} Axios config with Authorization header
 */
const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/**
 * Get all restaurants with associated stats
 * @param {string} token - Admin auth token
 * @returns {Promise<Array>} List of restaurants with stats
 */
const getRestaurantsWithStats = async (token) => {
  const response = await axios.get(`${API_URL}/restaurants`, authConfig(token));
  return response.data;
};

/**
 * Get analytics for a specific restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {string} token - Admin auth token
 * @returns {Promise<Object>} Analytics data
 */
const getRestaurantAnalytics = async (restaurantId, token) => {
  const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`, authConfig(token));
  return response.data;
};

/**
 * Create a new restaurant
 * @param {Object} restaurantData - New restaurant form data
 * @param {string} token - Admin auth token
 * @returns {Promise<Object>} Created restaurant
 */
const createRestaurant = async (restaurantData, token) => {
  const response = await axios.post(`${API_URL}/restaurants`, restaurantData, authConfig(token));
  return response.data;
};

/**
 * Update an existing restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} restaurantData - Updated form data
 * @param {string} token - Admin auth token
 * @returns {Promise<Object>} Updated restaurant
 */
const updateRestaurant = async (restaurantId, restaurantData, token) => {
  const response = await axios.put(
    `${API_URL}/restaurants/${restaurantId}`,
    restaurantData,
    authConfig(token)
  );
  return response.data;
};

/**
 * Toggle the active status of a restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {string} token - Admin auth token
 * @returns {Promise<Object>} Updated restaurant status
 */
const toggleRestaurantStatus = async (restaurantId, token) => {
  const response = await axios.patch(
    `${API_URL}/restaurants/${restaurantId}/toggle-status`,
    {},
    authConfig(token)
  );
  return response.data;
};

export default {
  getRestaurantsWithStats,
  getRestaurantAnalytics,
  createRestaurant,
  updateRestaurant,
  toggleRestaurantStatus,
};
