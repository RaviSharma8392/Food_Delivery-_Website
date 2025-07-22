import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/kitchen";
const axiosConfig = { withCredentials: true };

// Delete a food item by ID
export const deleteFoodItem = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deletefooditem/${id}`, axiosConfig);
    console.log("Food item deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting food item:", error.response || error);
    throw error;
  }
};

// Update availability of a food item
export const updateFoodAvailability = async (id, isAvailable) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/updateavailability/${id}`,
      { isAvailable },
      axiosConfig
    );
    console.log("Availability updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating availability:", error.response || error);
    throw error;
  }
};
// Optionally: Add more API functions here in future, like:
// - fetchAllFoodItems()
// - addNewFoodItem()
// - updateFoodItemDetails()
// src/api/restaurantApi.js
export const fetchRestaurantsByCity = async (city) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/public/restaurants?city=${city}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch restaurants");
    }
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
