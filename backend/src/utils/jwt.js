
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/index.js";

export const verifyToken = (token) => {
  return jwt.verify(token, TOKEN_SECRET); 
};

export const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn });
};
