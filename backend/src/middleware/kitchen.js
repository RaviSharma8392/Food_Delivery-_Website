import jwt from "jsonwebtoken";
import User from "../models/User.js";

const kitchenAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No token provided. Please login!" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.role !== "Kitchen") {
      return res.status(403).json({ message: "Access denied. Kitchen only." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
};

export default kitchenAuth;
