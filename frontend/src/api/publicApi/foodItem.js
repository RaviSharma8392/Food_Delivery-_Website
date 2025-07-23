// src/api/index.js
import axios from "axios";

// Use environment variable or fallback URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://munchiza.onrender.com";

/**
 * Fetch detailed information for a specific restaurant
 * @param {string} restaurantId - The unique ID of the restaurant
 * @returns {Promise<{ success: boolean, data?: object, message?: string }>}
 */
export const fetchRestaurantDetails = async (restaurantId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/public/restaurants/${restaurantId}/details`,
      {
        params: {
          include: "menu,categories", // Optional query param to include extra data
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
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
 * Fetch all food items available for search (public endpoint)
 * @returns {Promise<Array>} An array of food item objects
 */
export const searchFoodItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/public/foods`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching food items:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch food items"
    );
  }
};
