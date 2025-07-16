import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { TOKEN_SECRET } from "../config/index.js";

const adminAuth = async (req, res, next) => {
  // console.log("admin Called!");
  // console.log("Cookies:", req.cookies);

  const { token } = req.cookies;
  // console.log("Token from cookie:", token);

  if (!token) {
    return res.status(401).json({ message: 'Invalid token, please login!' });
  }

  try {
    const decodedToken = jwt.verify(token, TOKEN_SECRET);
    const { _id } = decodedToken;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    if (user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: 'Invalid token!' });
  }
};

export default adminAuth;
