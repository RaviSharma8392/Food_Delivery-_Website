// controllers/admin/salesController.js
import Order from "../../models/Order.js";

// Example helper: you can reuse these
const getTodayStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getWeekStart = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getMonthStart = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

const getSalesReport = async (req, res) => {
  try {
    const start = getTodayStart();
    const orders = await Order.find({
      status: "delivered",
      createdAt: { $gte: start }
    }).lean();

    let cash = 0;
    let online = 0;

    orders.forEach((order) => {
      if (order.method === "cash") cash += order.totalAmount;
      else online += order.totalAmount;
    });
    console.log(cash, online)

    res.json({ success: true, cash, online });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getWeeklySales = async (req, res) => {
  try {
    const start = getWeekStart();
    const orders = await Order.find({
      status: "delivered",
      createdAt: { $gte: start }
    }).lean();

    let cash = 0;
    let online = 0;
    console.log(cash, online)

    orders.forEach((order) => {
      if (order.method === "cash") cash += order.totalAmount;
      else online += order.totalAmount;
    });

    res.json({ success: true, cash, online });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getMonthlySalesCash = async (req, res) => {
  try {
    const start = getMonthStart();
    const orders = await Order.find({
      method: "cash",
      status: "delivered",
      createdAt: { $gte: start }
    });

    const total = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    console.log(total)
    res.json({ success: true, total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getMonthlySalesOnline = async (req, res) => {
  try {
    const start = getMonthStart();
    const orders = await Order.find({
      method: "online",
      status: "delivered",
      createdAt: { $gte: start }
    });

    const total = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.json({ success: true, total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export {
  getSalesReport,
  getWeeklySales,
  getMonthlySalesCash,
  getMonthlySalesOnline
};
