// controllers/admin/index.js
import { getSalesReport, getWeeklySales, getMonthlySalesCash, getMonthlySalesOnline } from "./salesController.js";

export const admin = {
  getSalesReport,
  getWeeklySales,
  getMonthlySalesCash,
  getMonthlySalesOnline,
  
};
