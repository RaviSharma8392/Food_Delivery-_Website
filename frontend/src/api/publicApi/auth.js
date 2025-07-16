import axios from "axios";

const API_URL =  "http://localhost:3000/api/v1";


// RaviRaj@gmail.com


export const signupUser = async (userData) => {
  console.log(userData)
  try {
    console.log("reached api")
    const response = await axios.post(`http://localhost:3000/api/v1/auth/createuser`, userData);
    console.log("response")
    console.log(userData)
    return {
      success: true,
      authToken: response.data.token,
      user: response.data.user
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message 
    };
  }
};


