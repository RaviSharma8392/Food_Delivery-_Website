// src/api/kitchenAndRestaurantApi.js

import axios from "axios";

// Base URLs
const BASE_KITCHEN_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/kitchen`;
const BASE_PUBLIC_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/public`;

// Common Axios config
const axiosConfig = { withCredentials: true };

/**
 * Delete a food item by its ID (Kitchen-side)
 * @param {string} id - Food item ID
 * @returns {Promise<Object>}
 */
export const deleteFoodItem = async (id) => {
  try {
    const response = await axios.delete(`${BASE_KITCHEN_URL}/deletefooditem/${id}`, axiosConfig);
    console.log("Food item deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting food item:", error.response || error);
    throw error.response?.data || error;
  }
};

/**
 * Update availability status of a food item
 * @param {string} id - Food item ID
 * @param {boolean} isAvailable - New availability status
 * @returns {Promise<Object>}
 */
export const updateFoodAvailability = async (id, isAvailable) => {
  try {
    const response = await axios.put(
      `${BASE_KITCHEN_URL}/updateavailability/${id}`,
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

/**
 * Fetch public restaurants by city
 * @param {string} city - City name to filter restaurants
 * @returns {Promise<Array>} Array of restaurants
 */
export const fetchRestaurantsByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_PUBLIC_URL}/restaurants`, {
      params: { city },
    });
// console.log(response)
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching restaurants by city:", error.response || error);
    throw error.response?.data || error;
  }
};

// 💡 Future extensions (examples):
// export const addNewFoodItem = async (data) => { ... }
// export const updateFoodItemDetails = async (id, data) => { ... }
