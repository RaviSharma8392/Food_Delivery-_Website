import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true, // ✅ Avoid duplicate subscriptions
  },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  location: {
    type: String,
    required: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
