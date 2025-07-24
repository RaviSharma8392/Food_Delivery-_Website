import express from "express";
import { kitchen } from "../../controllers/index.js";
import kitchenAuth from "../../middleware/restaurent.js";

const KitchenRouter = express.Router();

KitchenRouter.use(kitchenAuth);

// Orders
KitchenRouter.get("/orders", kitchen.getAllOrders);
KitchenRouter.patch("/orders/:id", kitchen.updateOrderStatus);

// Food Items
KitchenRouter.post("/addfooditem", kitchen.addFoodItem);
KitchenRouter.patch("/updateavailability/:id", kitchen.updateAvailability);
KitchenRouter.delete("/deletefooditem/:id", kitchen.deleteFoodItemById);
KitchenRouter.get("/categories", kitchen.getAllCategories);
KitchenRouter.get("/foodItems", kitchen.getFoodItemsByRestaurantId);



export default KitchenRouter;