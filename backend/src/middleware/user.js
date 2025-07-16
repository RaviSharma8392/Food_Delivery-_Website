
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = verifyToken(token); 
    const user = await User.findById(decoded._id);

    if (!user || user.role !== "User") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default userAuth;
