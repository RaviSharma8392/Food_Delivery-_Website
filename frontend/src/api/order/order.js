import axios from 'axios';

const API_URL = '/api/orders';

// Create new order
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, orderData, config);
  return response.data;
};

// Get user orders
const getMyOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/myorders`, config);
  return response.data;
};

// Get restaurant orders
const getRestaurantOrders = async (restaurantId, status, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      restaurantId,
      status,
    },
  };

  const response = await axios.get(`${API_URL}/restaurant/${restaurantId}`, config);
  return response.data;
};

// Update order status
const updateOrderStatus = async (orderId, status, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${orderId}/status`, { status }, config);
  return response.data;
};

const orderApi={
  createOrder,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
}
export default orderApi;