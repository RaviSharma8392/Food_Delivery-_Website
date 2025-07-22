// src/api/adminAnalyticsAPI.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/admin/analytics";

export const getPerformanceAnalytics = async (timeRange, startDate, endDate) => {
  const response = await axios.get(`${BASE_URL}/performance`, {
    params: {
      timeRange,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });
  console.log(response)
  
  return response.data;
};

export const getSalesAnalytics = async (period) => {
  const response = await axios.get("http://localhost:3000/api/v1/admin/analytics/sales", {
    params: { period },
  });
  return response.data; // Should return something like { timeline: [...] }
};