import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/admin/delivery-partners";

export const getDeliveryPartners = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updatePartnerStatus = async (id, currentStatus) => {
  const response = await axios.patch(`${BASE_URL}/${id}/status`, {
    active: !currentStatus,
  });
  return response.data;
};

export const saveDeliveryPartner = async (partnerData, editingPartner) => {
  if (editingPartner) {
    const response = await axios.put(
      `${BASE_URL}/${editingPartner._id}`,
      partnerData
    );
    return response.data;
  } else {
    const response = await axios.post(BASE_URL, partnerData);
    return response.data;
  }
};
