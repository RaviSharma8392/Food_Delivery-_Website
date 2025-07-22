// Auth APIs
import { signupUser } from "./publicApi/auth";

// Public APIs (Food & Restaurant)
import { fetchRestaurantDetails, searchFoodItems } from "./publicApi/foodItem";
import placeOrder from "./publicApi/placeOrder";
import orderApi from "./order/order";

// Admin APIs (Analytics)
import {
  getSalesToday,
  getWeeklySales,
  getMonthlySalesCash,
  getMonthlySalesOnline,
} from "./adminApi/adminApi";

// Grouped and exported as objects
const authAPI = {
  signupUser,
};

const publicAPI = {
  fetchRestaurantDetails,
  searchFoodItems,
  placeOrder,
};

const adminAPI = {
  getSalesToday,
  getWeeklySales,
  getMonthlySalesCash,
  getMonthlySalesOnline,
};
// Final export
export { authAPI, publicAPI, adminAPI,orderApi };
