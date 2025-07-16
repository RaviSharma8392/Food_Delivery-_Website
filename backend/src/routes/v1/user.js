import express from "express";
import { user } from "../../controllers/index.js";
// import userAuth from "../../middleware/user.js";

const userRouter = express.Router();

// userRouter.use(userAuth);



// Get order history
userRouter.get("/myOrders/:id", user.getOrderHistory);

export default userRouter;
