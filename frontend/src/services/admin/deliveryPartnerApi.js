// src/api/deliveryPartnersApi.js

import axios from "axios";

// Base URL for delivery partner admin endpoints
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/delivery-partners`;

/**
 * Fetch all delivery partners
 * @returns {Promise<Array>} List of delivery partners
 */
export const getDeliveryPartners = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching delivery partners:", error);
    throw error.response?.data || error;
  }
};

/**
 * Toggle a delivery partner's active status
 * @param {string} id - Partner's ID
 * @param {boolean} currentStatus - Current active status
 * @returns {Promise<Object>} Updated partner data
 */
export const updatePartnerStatus = async (id, currentStatus) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}/status`, {
      active: !currentStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating delivery partner status:", error);
    throw error.response?.data || error;
  }
};

/**
 * Save (create or update) delivery partner data
 * @param {Object} partnerData - The delivery partner form data
 * @param {Object|null} editingPartner - The partner being edited (if any)
 * @returns {Promise<Object>} The saved partner data
 */
export const saveDeliveryPartner = async (partnerData, editingPartner = null) => {
  try {
    if (editingPartner && editingPartner._id) {
      const response = await axios.put(
        `${BASE_URL}/${editingPartner._id}`,
        partnerData
      );
      return response.data;
    } else {
      const response = await axios.post(BASE_URL, partnerData);
      return response.data;
    }
  } catch (error) {
    console.error("Error saving delivery partner:", error);
    throw error.response?.data || error;
  }
};
