// src/api/kitchenApi.js

import axios from "axios";

// Base URL using environment variable
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/kitchen`;

// Common Axios config (for cookies/sessions)
const axiosConfig = {
  withCredentials: true,
};

/**
 * Delete a food item by its ID
 * @param {string} id - Food item ID
 * @returns {Promise<Object>} Axios response
 */
export const deleteFoodItem = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deletefooditem/${id}`, axiosConfig);
    console.log("Food item deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting food item:", error.response || error);
    throw error.response?.data || error;
  }
};

/**
 * Update the availability status of a food item
 * @param {string} id - Food item ID
 * @param {boolean} isAvailable - Availability status
 * @returns {Promise<Object>} Axios response
 */
export const updateFoodAvailability = async (id, isAvailable) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/updateavailability/${id}`,
      { isAvailable },
      axiosConfig
    );
    console.log("Availability updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating availability:", error.response || error);
    throw error.response?.data || error;
  }
};
