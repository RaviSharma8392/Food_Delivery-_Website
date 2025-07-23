// src/api/adminAnalyticsAPI.js

import axios from "axios";

// Base URL for admin analytics API
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/analytics`;

/**
 * Fetch performance analytics data for a given time range.
 * @param {string} timeRange - Preset time range (e.g., 'last_7_days', 'monthly', etc.)
 * @param {Date} startDate - Start date for the custom range
 * @param {Date} endDate - End date for the custom range
 * @returns {Promise<Object>} Analytics data including performance metrics
 */
export const getPerformanceAnalytics = async (timeRange, startDate, endDate) => {
  try {
    const response = await axios.get(`${BASE_URL}/performance`, {
      params: {
        timeRange,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    console.log(response); // For debugging purposes (remove in production)
    return response.data;
  } catch (error) {
    console.error("Error fetching performance analytics:", error);
    throw error;
  }
};

/**
 * Fetch sales analytics data for a given period.
 * @param {string} period - Time period (e.g., 'daily', 'weekly', 'monthly')
 * @returns {Promise<Object>} Sales data including timeline stats
 */
export const getSalesAnalytics = async (period) => {
  try {
    const response = await axios.get(`${BASE_URL}/sales`, {
      params: { period },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    throw error;
  }
};
