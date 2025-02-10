// IMPORT ALL REQUIRED MODULES AND FILES
import jwt from "jsonwebtoken";
import { secretKey } from "../config/config.js";

// VERFIY ROLE BASED ACCESS FUCNTION
export const verifyRole = (...roles) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[2];
    const decodedmsg = jwt.verify(token, secretKey);
    if (roles.includes(decodedmsg.role)) {
      req.user = decodedmsg;
      next();
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  };
};
