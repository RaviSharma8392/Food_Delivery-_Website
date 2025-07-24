import express from 'express';
const adminRouter = express.Router();
import {
  // Orders
  getAllOrders,
  getRecentOrders,
  getOrderStats,
  getOrderDetails,
  updateOrderStatus,
  assignDeliveryPartner,

  // Delivery Partners
  getAllDeliveryPartners,
  getAvailableDeliveryPartners,
  getDeliveryPartnerStats,
  getDeliveryPartnerDetails,
  createDeliveryPartner,
  updateDeliveryPartner,
  toggleDeliveryPartnerStatus,

  // Restaurants
  getAllRestaurants,
  getRestaurantStats,
  getRestaurantDetails,
  getRestaurantAnalytics,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
  getRestaurantPerformance,

  // Analytics
  getSalesAnalytics,
  getPerformanceAnalytics,
  getSalesReport,
  getWeeklySales,
  getMonthlySales,
  getMonthlySalesOnline,

  // System Stats
  getSystemStats,
  getPlatformEarnings,
  getAllUsersWithOrders,
} from '../../controllers/system/index.js';
import { publicCtrl } from '../../controllers/index.js';
import { getOwners } from '../../controllers/system/restaurantController.js';

// ================================
// 📦 ORDER ROUTES
// ================================
adminRouter.get('/orders', getAllOrders);
adminRouter.get('/orders/recent', getRecentOrders);
adminRouter.get('/orders/stats', getOrderStats);
adminRouter.get('/orders/:id', getOrderDetails);
adminRouter.patch('/orders/:id/status', updateOrderStatus);
adminRouter.patch('/orders/:id/assign', assignDeliveryPartner);

// ================================
// 🚚 DELIVERY PARTNER ROUTES
// ================================
adminRouter.get('/delivery-partners', getAllDeliveryPartners);
adminRouter.get('/delivery-partners/available', getAvailableDeliveryPartners);
adminRouter.get('/delivery-partners/stats', getDeliveryPartnerStats);
adminRouter.get('/delivery-partners/:id', getDeliveryPartnerDetails);
adminRouter.post('/delivery-partners', createDeliveryPartner);
adminRouter.put('/delivery-partners/:id', updateDeliveryPartner);
adminRouter.patch('/delivery-partners/:id/status', toggleDeliveryPartnerStatus);

// ================================
// 🍽 RESTAURANT ROUTES
// ================================
adminRouter.get('/restaurants', getAllRestaurants);
adminRouter.get('/restaurants/stats', getRestaurantStats);
adminRouter.get('/restaurants/:id', getRestaurantDetails);
adminRouter.get('/restaurants/:id/analytics', getRestaurantAnalytics);
adminRouter.post('/restaurants', createRestaurant);
adminRouter.post("/addRestro", publicCtrl.createRestaurant);

adminRouter.put('/restaurants/:id', updateRestaurant);
adminRouter.patch('/restaurants/:id/status', toggleRestaurantStatus);
adminRouter.delete('/restaurants/:id', deleteRestaurant);
adminRouter.get('/analytics/restaurants', getRestaurantPerformance);
// routes/userRoutes.js
adminRouter.get("/owners", getOwners);

// ================================
// 📊 ANALYTICS ROUTES
// ================================
adminRouter.get('/analytics/sales', getSalesAnalytics);
adminRouter.get('/analytics/performance', getPerformanceAnalytics);
adminRouter.get('/analytics/sales-report', getSalesReport);
adminRouter.get('/analytics/weekly-sales', getWeeklySales);
adminRouter.get('/analytics/monthly-sales', getMonthlySales);
adminRouter.get('/analytics/monthly-sales-online', getMonthlySalesOnline);

adminRouter.get('/users', getAllUsersWithOrders);



// for creating new categotry by admin
adminRouter.post("/category/add", publicCtrl.addCategory);



// adminRouter.get('/system/stats', getSystemStats);
// adminRouter.get('/system/platform-earnings', getPlatformEarnings);

export default adminRouter;