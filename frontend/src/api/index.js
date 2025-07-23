// src/api/index.js

// ------------------------
// ✅ Auth APIs
// ------------------------
import { signupUser } from "./publicApi/auth";

// ------------------------
// ✅ Public APIs (Food & Restaurant)
// ------------------------
import { fetchRestaurantDetails, searchFoodItems } from "./publicApi/foodItem";
import placeOrder from "./publicApi/placeOrder";

// ------------------------
// ✅ Order APIs (User/Restaurant-based)
// ------------------------
import orderApi from "./order/order";

// ------------------------
// ✅ Admin Analytics APIs
// ------------------------
import {
  getSalesToday,
  getWeeklySales,
  getMonthlySalesCash,
  getMonthlySalesOnline,
} from "./adminApi/adminApi";

// ------------------------
// ✅ Grouped API Interfaces
// ------------------------

// Auth API object
const authAPI = {
  signupUser,
};

// Public API object for frontend/public use
const publicAPI = {
  fetchRestaurantDetails,
  searchFoodItems,
  placeOrder,
};

// Admin-side analytics API object
const adminAPI = {
  getSalesToday,
  getWeeklySales,
  getMonthlySalesCash,
  getMonthlySalesOnline,
};

// ------------------------
// ✅ Unified Export
// ------------------------
export { authAPI, publicAPI, adminAPI, orderApi };
