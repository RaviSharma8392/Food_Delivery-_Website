import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
   email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

 

  phoneNumber: {
    type: String,
  },

  password: {
    type: String,
  },
  address:{
     type: String,

  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  role: {
    type: String,
    enum: ['Restaurent', 'Admin', 'User'],
    default: 'User',
  },
});

export default mongoose.model("User", UserSchema);
