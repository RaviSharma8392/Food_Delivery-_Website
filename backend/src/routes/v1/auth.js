// routes/authRouter.js
import express from "express";
import { auth } from "../../controllers/index.js";

const authRouter = express.Router();

authRouter.post("/createuser", auth.registerUser);
authRouter.post("/login", auth.loginUser);
authRouter.post("/forgot-password", auth.forgotPassword); // NEW
authRouter.post("/reset-password", auth.resetPassword);  // NEW

export default authRouter;
