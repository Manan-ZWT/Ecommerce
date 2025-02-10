// IMPORT ALL REQUIRED MODULES AND FILES
import jwt from "jsonwebtoken";
import { secretKey } from "../config/config.js";

// VERIFY JWT TOKEN FUCNTION
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[2];

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  const decoded_data = jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired token.Please Login again." });
    }
    next();
  });
};
