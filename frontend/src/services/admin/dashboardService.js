// src/services/dashboardService.js

import axios from "axios";

// Base URL for admin-related dashboard APIs
const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin`;

/**
 * Fetch overall order statistics (e.g., total orders, revenue, etc.)
 * @returns {Promise<Object>} Order statistics data
 */
export const getOrderStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/orders/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch statistics about restaurants (e.g., active/inactive counts)
 * @returns {Promise<Object>} Restaurant statistics data
 */
export const getRestaurantStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/restaurants/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant stats:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch statistics about delivery partners (e.g., available/on-delivery)
 * @returns {Promise<Object>} Delivery partner statistics data
 */
export const getDeliveryPartnerStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/delivery-partners/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching delivery partner stats:", error);
    throw error.response?.data || error;
  }
};
