import axios from 'axios';

const API_URL = '/api/admin';

// Get all restaurants with stats
const getRestaurantsWithStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/restaurants`, config);
  return response.data;
};

// Get restaurant analytics
const getRestaurantAnalytics = async (restaurantId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`, config);
  return response.data;
};

// Create restaurant
const createRestaurant = async (restaurantData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/restaurants`, restaurantData, config);
  return response.data;
};

// Update restaurant
const updateRestaurant = async (restaurantId, restaurantData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/restaurants/${restaurantId}`, restaurantData, config);
  return response.data;
};

// Toggle restaurant status
const toggleRestaurantStatus = async (restaurantId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.patch(
    `${API_URL}/restaurants/${restaurantId}/toggle-status`,
    {},
    config
  );
  return response.data;
};

export default {
  getRestaurantsWithStats,
  getRestaurantAnalytics,
  createRestaurant,
  updateRestaurant,
  toggleRestaurantStatus,
};