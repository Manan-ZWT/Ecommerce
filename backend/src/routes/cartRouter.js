// IMPORTING REQUIRED MODULES AND FILES
import express from "express";
import { verifyToken } from "../middlewares/jwtAuth.js";
import { verifyRole } from "../middlewares/validateRole.js";
import {
  addToCart,
  showCart,
  deleteFromCart,
} from "../controllers/cartController.js";

// CREATING ROUTES FOR "/cart" REQUEST
const router = express.Router();
router.get("/", verifyToken, verifyRole("customer"), showCart);
router.post("/", verifyToken, verifyRole("customer"), addToCart);
router.delete("/:id", verifyToken, verifyRole("customer"), deleteFromCart);

export default router;
