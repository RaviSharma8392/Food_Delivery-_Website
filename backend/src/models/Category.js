import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
   
  },
  { timestamps: true }
);

export default mongoose.model("categories", categorySchema);
