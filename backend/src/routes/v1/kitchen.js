import express from "express";
import { kitchen } from "../../controllers/index.js";
import kitchenAuth from "../../middleware/kitchen.js";

const KitchenRouter = express.Router();

KitchenRouter.use(kitchenAuth);

// Orders
KitchenRouter.get("/orders", kitchen.getAllOrders);
KitchenRouter.patch("/orders/:id", kitchen.updateOrderStatus);

// Food Items
KitchenRouter.post("/addfooditem", kitchen.addFoodItem);
KitchenRouter.put("/updateavailability/:id", kitchen.updateAvailability);
KitchenRouter.delete("/deletefooditem/:id", kitchen.deleteFoodItemById);

// Categories
KitchenRouter.post("/addCategory", kitchen.addCategory);

export default KitchenRouter;
