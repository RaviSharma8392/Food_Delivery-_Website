export const getSalesToday = async () => {
  const res = await adminAPI.get("/salesToday");
  return res.data;
};

export const getWeeklySales = async () => {
  const res = await adminAPI.get("/weeklySales");
  return res.data;
};

export const getMonthlySalesCash = async () => {
  const res = await adminAPI.get("/monthlySales");
  return res.data;
};

export const getMonthlySalesOnline = async () => {
  const res = await adminAPI.get("/monthlySalesOnline");
  return res.data;
};
// new logic

