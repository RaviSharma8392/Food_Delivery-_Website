import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/admin/orders";

export const fetchOrders = async () => {
  const response = await axios.get(`${BASE_URL}/recent`, {
  });
  console.log("Fetched orders:", response.data);
  return response.data;
};

export const updateOrderStatus = async (orderId, newStatus) => {
  await axios.patch(`${BASE_URL}/${orderId}/status`, { status: newStatus });
};

export const assignDeliveryPartner = async (orderId, partnerId) => {
  await axios.patch(`${BASE_URL}/${orderId}/assign`, {
    deliveryPartner: partnerId,
  });
};
