import express from "express";
import { auth } from "../../controllers/index.js";

const authRouter = express.Router();

authRouter.post("/createuser", auth.registerUser);
authRouter.post("/login", auth.loginUser);

export default authRouter;
