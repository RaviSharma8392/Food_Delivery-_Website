import express from "express";
import { getRestaurantOrders, updateOrderStatus } from "../../controllers/restaurent/restaurantOrderController.js";
import { kitchen, publicCtrl } from "../../controllers/index.js";

const restaurentRouter = express.Router();


//   All routes are under /api/v1/restaurent
restaurentRouter.get("/orders", kitchen.getAllOrders);
restaurentRouter.patch("/orders/:id", kitchen.updateOrderStatus);

// Food Items
// KitchenRouter.post("/addfooditem", kitchen.addFoodItem);
restaurentRouter.put("/updateavailability/:id", kitchen.updateAvailability);
restaurentRouter.delete("/deletefooditem/:id", kitchen.deleteFoodItemById);

// Get all orders for a restaurant
restaurentRouter.get("/orders", getRestaurantOrders);

// Update order status (e.g., accepted, preparing, delivered)
restaurentRouter.patch("/orders/:id/status", updateOrderStatus);

// Add a new food item to the restaurant's menu
restaurentRouter.post("/addFood", publicCtrl.addFoodItem);

export default restaurentRouter;
