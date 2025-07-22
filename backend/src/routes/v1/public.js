import express from "express";
import { publicCtrl } from "../../controllers/index.js";
import { getRestaurantOrders } from "../../controllers/restaurent/restaurantOrderController.js";

const publicRouter = express.Router();

/**
 * Public API Routes
 * All routes are under /api/v1/public/*
 */

publicRouter.get("/orders", getRestaurantOrders ,);

// Place a new order
publicRouter.post("/placeorder", publicCtrl.placeOrder);

// Get food menu & categories for a restaurant
publicRouter.get("/restaurants/:id/details", publicCtrl.getFoodData);

publicRouter.get("/restaurants/by-name/:slug", publicCtrl.getRestroData);




// Add a food item



// Get all food items
publicRouter.get("/foods", publicCtrl.getFoodItem);

// Get all restaurants
publicRouter.get("/restaurants", publicCtrl.getAllRestaurants);

// Get restaurant by ID
publicRouter.get("/restaurant/:id", publicCtrl.getRestaurantById);



// 🔔 Send Notification
publicRouter.post("/send-notification", publicCtrl.sendNotifications);
publicRouter.get("/dashboard/:restaurantId", publicCtrl.getRestaurantDashboardStats);


export default publicRouter;
