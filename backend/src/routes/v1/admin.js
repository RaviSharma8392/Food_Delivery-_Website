// routes/v1/admin.js
import express from "express";
import { admin } from "../../controllers/index.js";
import adminAuth from "../../middleware/admin.js";

const adminRouter = express.Router();

// All routes below are protected
adminRouter.use(adminAuth);

// Route: GET /api/v1/admin/salesToday
adminRouter.get("/salesToday", admin.getSalesReport);

// Route: GET /api/v1/admin/weeklySales
adminRouter.get("/weeklySales", admin.getWeeklySales);

// Route: GET /api/v1/admin/monthlySales
adminRouter.get("/monthlySales", admin.getMonthlySalesCash);

// Route: GET /api/v1/admin/monthlySalesOnline
adminRouter.get("/monthlySalesOnline", admin.getMonthlySalesOnline);

// Optional: More admin routes (orders, analytics, etc.) can be added below

export default adminRouter;
