import FoodItem from "../../models/FoodItem.js";
import Category from "../../models/Category.js";
import Order from "../../models/Order.js";
import sendEmailNotification from "../../utils/whatshappMessage.js";
import { StatusCodes } from "http-status-codes";

// ✅ Get all available food items and categories
export const getFoodData = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ isAvailable: true });
    const foodCategories = await Category.find();

    if (foodItems.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No food items found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      foodItems,
      foodCategories,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Place a new order
export const placeOrder = async (req, res) => {
  try {
    const {
      userId, name, phone, email,
      address, method, subtotal,
      deliveryFee, totalAmount, items,
    } = req.body;

    // 🔒 Validate required fields
    if (!address || !method || !subtotal || !deliveryFee || !totalAmount || !items?.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required order details",
      });
    }

    if (!userId && (!name || !phone)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Guest orders must include name and phone",
      });
    }

    const newOrder = new Order({
      userId: userId || null,
      name, phone, email, address,
      method, subtotal, deliveryFee, totalAmount, items,
    });

    await newOrder.save();
    console.log("✅ Order saved");

    // 📩 Send WhatsApp/Email Notification
    await sendEmailNotification({
      userId, name, phone, email,
      address, method, subtotal, deliveryFee, totalAmount, items,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error("❌ Error placing order:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
