import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import Order from "../../models/Order.js";



// Get order history for a user
export const getOrderHistory = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.itemId", "name options imageUrl")
      .lean();

    const formattedOrders = orders.map((order) => {
      let subtotal = 0;

      const items = order.items.map((item) => {
        const portion = item.portion;
        const options = item.itemId?.options || {};
        const price = parseFloat(options[portion] || "0");
        const totalPrice = price * item.quantity;
        subtotal += totalPrice;

        return {
          name: item.itemId?.name || "Item Deleted",
          image: item.itemId?.imageUrl || "",
          price,
          quantity: item.quantity,
          portion,
          totalPrice,
        };
      });

      return {
        orderId: order._id,
        createdAt: order.createdAt,
        address: order.address,
        paymentMethod: order.method,
        status: order.status,
        subtotal,
        deliveryFee: order.deliveryFee || 0,
        totalAmount: subtotal + (order.deliveryFee || 0),
        items,
      };
    });

    res.status(StatusCodes.OK).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });

  } catch (error) {
    console.error("❌ Error fetching order history:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching order history",
      error: error.message,
    });
  }
};
