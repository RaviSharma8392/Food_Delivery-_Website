import Order from "../../models/Order.js";
import Restaurant from "../../models/Restaurant.js";

// 🧾 GET: Orders for restaurant
export const getRestaurantOrders = async (req, res) => {
  console.log("✅ Incoming GET /restaurant/orders");

  try {
    // Use restaurant from middleware OR find using default userId
    let restaurantId;

    if (req.restaurant?._id) {
      restaurantId = req.restaurant._id;
      console.log("✅ Authenticated restaurant ID:", restaurantId);
    } else {
      const userId = req.user?._id || req.query.userId || req.body?.userId || "687d40695f1879e5b0c9890a";
      const restaurant = await Restaurant.findOne({ owner: userId });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found for this user" });
      }

      restaurantId = restaurant._id;
      console.log("✅ Fallback restaurant ID from user:", restaurantId);
    }

    const orders = await Order.find({ restaurantId })
      .populate("items.itemId") // ✅ Full item details for frontend
      .select("-userInfo -userContact")
      .sort({ createdAt: -1 });

    console.log(`📦 Total orders found: ${orders.length}`);
    res.json({ orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};
// export const getCategoryByName = async (req, res) => {
//   try {
//     const name = req.query.name;
//     const category = await Category.findOne({
//       name: { $regex: new RegExp(name, "i") },
//     });

//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.status(200).json({ category });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// 🔁 PATCH: Update order status
export const updateOrderStatus = async (req, res) => {
  console.log("✅ Incoming PATCH /restaurant/orders/:id/status");

  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const userId = req.user?._id || req.body?.userId || "687d40695f1879e5b0c9890a";

    console.log("🆕 Status to update:", status);
    console.log("🔍 Using user ID:", userId);

    const restaurant = await Restaurant.findOne({ owner: userId });

    if (!restaurant) {
      console.log("❌ Restaurant not found for user:", userId);
      return res.status(404).json({ message: "Restaurant not found for this user" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, restaurantId: restaurant._id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found or doesn't belong to restaurant" });
    }

    console.log(`✅ Order ${orderId} updated to status: ${status}`);
    res.json({ order });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};
