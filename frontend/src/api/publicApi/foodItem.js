// src/api/index.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Fetch detailed information for a specific restaurant
 * @param {string} restaurantId - Unique ID of the restaurant
 * @returns {Promise<{ success: boolean, res?: object, message?: string }>}
 */

export const fetchRestaurantDetails = async (restaurantId) => {
  try {
    console.log(restaurantId)
    const response = await axios.get(
      `${BASE_URL}/api/v1/public/restaurants/${restaurantId}/details`,
      {
        params: {
          include: "menu,categories", // include menu and category data
        },
      }
    );
    console.log(response)

    return {
      success: true,
      data: response.data.data, // ✅ renamed from `res` to `data` (more conventional)
    };
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to fetch restaurant details",
    };
  }
};

/**
 * Fetch all food items for search
 * @returns {Promise<Array>} Array of food item objects
 */
export const searchFoodItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/public/foods`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching food items:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch food items"
    );
  }
};
