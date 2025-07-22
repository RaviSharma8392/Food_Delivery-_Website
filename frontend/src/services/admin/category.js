import axios from "axios";

export const createCategory = async ({ name, image }) => {
  try {
    const response = await axios.post("http://localhost:3000/api/v1/admin/category/add", {
      name,
      image,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
