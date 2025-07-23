// src/api/restaurantApi.js

import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/restaurants`;
console.log(BASE_URL)

/**
 * Fetch all restaurants, with optional search term
 * @param {string} searchTerm
 * @returns {Promise<Array>}
 */
export const fetchRestaurants = async (searchTerm = "") => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { search: searchTerm },
    });

    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

/**
 * Toggle a restaurant's active status
 * @param {string} id
 * @param {boolean} currentStatus
 * @returns {Promise<Object>}
 */
export const toggleRestaurantStatus = async (id, currentStatus) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}/status`, {
      active: !currentStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling restaurant status:", error);
    throw error;
  }
};

/**
 * Save restaurant data (create or update)
 * @param {Object} restaurantData
 * @param {Object|null} editingRestaurant
 * @returns {Promise<Object>}
 */
export const saveRestaurant = async (restaurantData, editingRestaurant = null) => {
  try {
    const url = editingRestaurant?._id
      ? `${BASE_URL}/${editingRestaurant._id}`
      : BASE_URL;

    const method = editingRestaurant?._id ? "put" : "post";

    const response = await axios[method](url, restaurantData);
    return response.data;
  } catch (error) {
    console.error("Error saving restaurant:", error);
    throw error;
  }
};

/**
 * Delete a restaurant
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteRestaurant = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw error;
  }
};

/**
 * Get restaurant by slug and location
 * @param {string} slug
 * @param {string} [location="bhimtal"]
 * @returns {Promise<Object>}
 */
export const getRestaurantBySlug = async (slug, location = "bhimtal") => {
  try {
    const PUBLIC_API = `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/restaurants/by-name/${slug}?location=${location}`;
    const response = await axios.get(PUBLIC_API);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant by slug:", error);
    throw error;
  }
};
