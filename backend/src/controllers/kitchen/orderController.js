import Order from "../../models/Order.js";
import { StatusCodes } from "http-status-codes";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "name email phoneNumber")
      .populate("items.itemId", "name options imageUrl image")
      .lean();

    const formattedOrders = orders.map((order) => {
      let subtotal = 0;

      const items = order.items.map((item) => {
        const portion = item.portion;
        const itemData = item.itemId || {};
        const price = parseFloat(itemData.options?.[portion] || "0");
        const totalPrice = price * item.quantity;
        subtotal += totalPrice;

        return {
          itemId: itemData._id,
          name: itemData.name || "Item Deleted",
          image: itemData.imageUrl || itemData.image || null,
          portion,
          price,
          quantity: item.quantity,
          totalPrice,
        };
      });

      const user = order.userId
        ? {
            _id: order.userId._id,
            name: order.userId.name,
            email: order.userId.email,
            phone: order.userId.phoneNumber,
          }
        : {
            name: order.name || "Guest",
            phone: order.phone || "",
          };

      return {
        _id: order._id,
        createdAt: order.createdAt,
        address: order.address,
        method: order.method,
        status: order.status,
        subtotal,
        deliveryFee: order.deliveryFee || 0,
        totalAmount: subtotal + (order.deliveryFee || 0),
        items,
        user,
      };
    });

    res.status(StatusCodes.OK).json(formattedOrders);

  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Admin/Kitchen: Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
