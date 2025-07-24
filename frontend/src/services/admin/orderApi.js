// src/api/ordersApi.js

import axios from "axios";

// Base URL for admin order-related endpoints
const API=`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin`
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/orders`;
console.log(BASE_URL)

/**
 * Fetch recent orders for the admin dashboard
 * @returns {Promise<Array>} List of recent orders
 */
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/recent`);
    console.log("Fetched orders:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error.response?.data || error;
  }
};

/**
 * Update the status of a specific order
 * @param {string} orderId - Order ID
 * @param {string} newStatus - New status (e.g., 'delivered', 'cancelled')
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/${orderId}/status`,
      { status: newStatus }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error.response?.data || { message: "Unknown error" };
  }
};

/**
 * Assign a delivery partner to a specific order
 * @param {string} orderId - Order ID
 * @param {string} partnerId - Delivery partner ID
 * @returns {Promise<void>}
 */
export const assignDeliveryPartner = async (orderId, partnerId) => {
  try {
    await axios.patch(`${BASE_URL}/${orderId}/assign`, {
      deliveryPartner: partnerId,
    });
  } catch (error) {
    console.error(`Error assigning delivery partner for order ${orderId}:`, error);
    throw error.response?.data || error;
  }
};
export const createRestaurant = async (restaurantData) => {
  try {
    const response = await axios.post(
      `${API}/addRestro`,
      restaurantData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating restaurant:", error);
    throw error.response?.data || { message: "Unknown error" };
  }
};