// controllers/system/index.js


export{
  getAllUsersWithOrders
}
from"./systemController.js"
// ======================
// 📦 Order Controllers
// ======================
export { 
  getAllOrders,
  getRecentOrders,
  getOrderDetails,
  getOrderStats,
  updateOrderStatus,
  assignDeliveryPartner
} from './orderController.js';

// ============================
// 🍽 Restaurant Controllers
// ============================
export {deleteRestaurant,
  getAllRestaurants,
  getRestaurantDetails,
  getRestaurantStats,
  getRestaurantAnalytics,
  createRestaurant,
  updateRestaurant,
  toggleRestaurantStatus,
  getRestaurantPerformance
} from './restaurantController.js';

// ============================
// 🚚 Delivery Partner Controllers
// ============================
export {
  getAllDeliveryPartners,
  getAvailableDeliveryPartners,
  getDeliveryPartnerDetails,
  getDeliveryPartnerStats,
  createDeliveryPartner,
  updateDeliveryPartner,
  toggleDeliveryPartnerStatus
} from './deliveryPartnerController.js';

// ============================
// 📊 Analytics Controllers
// ============================
export {
  getSalesAnalytics,
  getPerformanceAnalytics,
  getSalesReport,
  getWeeklySales,
  getMonthlySales,
  getMonthlySalesOnline
} from './analyticsController.js';

// ============================
// ⚙️ System Controllers
// ============================
export {
  getSystemStats,
  getPlatformEarnings
} from './systemController.js';
