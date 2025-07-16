import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/admin";

const config = {
  withCredentials: true, // components for sending cookies (token)
};

export const getSalesToday = () => {
  return axios.get(`${BASE_URL}/salesToday`, config);
};

export const getWeeklySales = () => {
  return axios.get(`${BASE_URL}/weeklySales`, config);
};

export const getMonthlySalesCash = () => {
  return axios.get(`${BASE_URL}/monthlySales`, config);
};

export const getMonthlySalesOnline = () => {
  return axios.get(`${BASE_URL}/monthlySalesOnline`, config);
};

