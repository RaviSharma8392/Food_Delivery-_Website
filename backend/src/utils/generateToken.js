import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/index.js";

export const generateToken = (userId, role) => {
  return jwt.sign({ _id: userId, role }, TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
