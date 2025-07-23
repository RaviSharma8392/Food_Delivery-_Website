// src/api/categoryApi.js

import axios from "axios";

// Base URL for admin category management
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin`;

/**
 * Create a new category with a name and image
 * @param {Object} payload
 * @param {string} payload.name - Name of the category
 * @param {string} payload.image - Image URL or base64-encoded image
 * @returns {Promise<Object>} The newly created category data
 */
export const createCategory = async ({ name, image }) => {
  try {
    const response = await axios.post(`${BASE_URL}/category/add`, {
      name,
      image,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error.response?.data || error;
  }
};
