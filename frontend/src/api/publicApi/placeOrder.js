import axios from "axios";



const placeOrderAPI = async (orderData, token) => {
  const response = await axios.post(
    "http://localhost:3000/api/v1/public/placeorder",
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export default placeOrderAPI;
