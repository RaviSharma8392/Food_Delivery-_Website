// src/services/dashboardService.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api/v1/admin";

export const getOrderStats = () =>
  axios.get(`${API_BASE}/orders/stats`).then((res) => res.data);

export const getRestaurantStats = () =>
  axios.get(`${API_BASE}/restaurants/stats`).then((res) => res.data);

export const getDeliveryPartnerStats = () =>
  axios.get(`${API_BASE}/delivery-partners/stats`).then((res) => res.data);
