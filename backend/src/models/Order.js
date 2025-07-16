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
    // Make userId optional for guest orders
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // ✅ Guest info fields (optional if logged in)
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
      enum: ["pending","delivered", "cancelled"],
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
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
