import express from "express";
import { kitchen } from "../../controllers/index.js";
// import kitchenAuth from "../../middleware/kitchen.js";

const KitchenRouter = express.Router();

// KitchenRouter.use(kitchenAuth);

// Orders


// Categories
// KitchenRouter.post("/addCategory", kitchen.addCategory);

export default KitchenRouter;
