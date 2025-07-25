import express from "express";
import publicRouter from "./public.js"; // Update this to match your real file
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import userRouter from "./user.js";
import KitchenRouter from "./kitchen.js";
import restaurentRouter from "./restaurent.js";
import foodRouter from "./foodItem.js";

const router = express.Router();

router.use("/public", publicRouter);
router.use("/auth",authRouter)
router.use("/admin",adminRouter)
router.use("/user",userRouter)
router.use("/kitchen",KitchenRouter)
router.use("/restaurent",restaurentRouter)
router.use("/food",foodRouter)






export default router;
