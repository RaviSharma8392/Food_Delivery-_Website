// src/routes/v1/public.js
import express from "express";
import { publicCtrl } from "../../controllers/index.js";


const publicRouter = express.Router();
// Place order
publicRouter.post("/placeorder", publicCtrl.placeOrder);

publicRouter.get("/foods", publicCtrl.getFoodData);

export default publicRouter;
