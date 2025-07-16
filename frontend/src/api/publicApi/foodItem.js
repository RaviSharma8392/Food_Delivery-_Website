import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const fetchFoodList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/public/foods`, {
   
    });

    return response.data || [];
  } catch (error) {
    console.error("❌ Error fetching food list:", error.message);
    return [];
  }
};
