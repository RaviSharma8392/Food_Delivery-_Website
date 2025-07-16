import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/kitchen";

export const deleteFoodItem = (id) =>
  axios.delete(`${BASE_URL}/deletefooditem/${id}`, {
    withCredentials: true,
  });

export const updateFoodAvailability = async (id, isAvailable) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/v1/kitchen/updateavailability/${id}`,
      { isAvailable },
      { withCredentials: true }
    );
    console.log("Availability updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error from updateFoodAvailability:", error.response || error);
    throw error;
  }
};

