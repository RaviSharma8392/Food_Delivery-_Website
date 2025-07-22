// routes/food.routes.js
import express from "express";
import { getItemsByLocationAndCategory } from "../../controllers/foodController/foodController.js";

const foodRouter = express.Router();

foodRouter.get("items/:location/:category", getItemsByLocationAndCategory);

export default foodRouter;
