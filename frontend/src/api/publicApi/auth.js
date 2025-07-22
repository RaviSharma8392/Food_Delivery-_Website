import axios from "axios";

//  Custom Axios instance for Auth APIs
const authAPI = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});


//   Login User
 
export const loginUser = async (credentials) => {
  const response = await authAPI.post("/login", credentials);
  return response.data;
};


//  Signup User
 
export const signupUser = async (userData) => {
  try {
    const response = await authAPI.post("/createuser", userData);
    return {
      success: true,
      authToken: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Signup failed",
    };
  }
};
