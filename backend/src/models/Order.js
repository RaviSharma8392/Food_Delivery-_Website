import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "food_items",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  portion: {
    type: String,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    name: {
      type: String,
      required: function () {
        return !this.userId;
      },
    },
    phone: {
      type: String,
      required: function () {
        return !this.userId;
      },
    },
    email: {
      type: String,
      required: false,
    },

    address: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      enum: ["cash", "online"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "cancelled", "out_for_delivery"],
      default: "pending",
    },
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      validate: [
        (val) => val.length > 0,
        "Order must contain at least one item",
      ],
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner", // 👈 Ensure this matches your model name exactly
      required: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
