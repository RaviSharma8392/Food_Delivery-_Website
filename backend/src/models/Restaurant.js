import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  logo: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  mainLocation: {
    type: String,
    trim: true,
  },
  subLocation: {
    type: String,
    default: "",
    trim: true,
  },
  cuisine: {
    type: String,
    trim: true,
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  deliveryTime: {
    type: Number,
    default: 30,
  },
  costForTwo: {
    type: String,
    default: "₹500 for two",
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/300x200?text=Restaurant",
  },
  promoted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true, // ✅ Added field
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
