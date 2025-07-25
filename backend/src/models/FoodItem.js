import  mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    options: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
     restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", // Reference to Restaurant model
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("food_items", foodItemSchema);
