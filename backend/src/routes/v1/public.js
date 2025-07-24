import express from "express";
import { publicCtrl } from "../../controllers/index.js";

// import { getRestaurantOrders } from "../../controllers/restaurent/restaurantOrderController.js";

// console.log("getCategoryByName loaded?", typeof publicCtrl.getCategoryByName); // should be "function"
// console.log("getRestaurantsByLocationAndCategory:", typeof publicCtrl.getRestaurantsByLocationAndCategory);

const publicRouter = express.Router();

/**
 * Public API Routes
 * Base Path: /api/v1/public/*
 */

// ✔ Get restaurant orders (admin or owner use case)
// publicRouter.get("/orders", getRestaurantOrders);

// ✔ Place a new order
publicRouter.post("/placeorder", publicCtrl.placeOrder);

// ✔ Get food menu & categories for a restaurant
publicRouter.get("/restaurants/:id/details", publicCtrl.getFoodData);

// ✔ Get restaurant by slug
publicRouter.get("/restaurants/by-name/:slug", publicCtrl.getRestroData);

// ✔ Filter restaurants based on category + location (frontend calls this for category page)
publicRouter.get("/restaurant/by-location-category", publicCtrl.getRestaurantsByLocationAndCategory);

// ✔ Filter food items (used when clicking restaurant inside category page)
publicRouter.get("/food/filter", publicCtrl.getFilteredFoodItems);

// ✔ Get all food items (optional/all)
publicRouter.get("/foods", publicCtrl.getFoodItem);

// ✔ Get all restaurants
publicRouter.get("/restaurants", publicCtrl.getAllRestaurants);

// ✔ Get restaurant by ID
publicRouter.get("/restaurant/:id", publicCtrl.getRestaurantById);

// ✔ Get category by name (frontend helper to fetch ID from name, optional)
publicRouter.get("/category/by-name",publicCtrl. getCategoryByName);

// ✔ Send notification to restaurant
publicRouter.post("/send-notification", publicCtrl.sendNotifications);

// ✔ Get dashboard stats
publicRouter.get("/dashboard/:restaurantId", publicCtrl.getRestaurantDashboardStats);

export default publicRouter;
