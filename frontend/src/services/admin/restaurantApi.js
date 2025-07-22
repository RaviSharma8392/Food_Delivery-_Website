import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/admin/restaurants";

/**
 * Fetch all restaurants, with optional searchTerm
 * @param {string} searchTerm
 * @returns {Promise<Array>}
 */
export const fetchRestaurants = async (searchTerm = "") => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { search: searchTerm },
    });

    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
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
 * Save (create or update) restaurant data
 * @param {Object} restaurantData
 * @param {Object|null} editingRestaurant
 * @returns {Promise<Object>}
 */
export const saveRestaurant = async (restaurantData, editingRestaurant) => {
  try {
    if (editingRestaurant && editingRestaurant._id) {
      const response = await axios.put(
        `${BASE_URL}/${editingRestaurant._id}`,
        restaurantData
      );
      return response.data;
    } else {
      const response = await axios.post(BASE_URL, restaurantData);
      return response.data;
    }
  } catch (error) {
    console.error("Error saving restaurant:", error);
    throw error;
  }
};

/**
 * (Optional) Delete a restaurant
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

export const getRestaurantBySlug = async (slug, location = "bhimtal") => {
  const res = await axios.get(
    `http://localhost:3000/api/v1/public/restaurants/by-name/${slug}?location=${location}`
  );
  return res.data;
};