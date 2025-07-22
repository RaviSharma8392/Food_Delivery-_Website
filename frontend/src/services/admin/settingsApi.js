import axios from "axios";

const SETTINGS_URL = "/api/admin/settings";

export const saveSettings = async (settings) => {
  const response = await axios.put(SETTINGS_URL, settings);
  return response.data;
};

export const getSettings = async () => {
  const response = await axios.get(SETTINGS_URL);
  return response.data;
};
