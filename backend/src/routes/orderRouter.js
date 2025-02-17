// IMPORTING REQUIRED MODULES AND FILES
import express from "express";
import { verifyToken } from "../middlewares/jwtAuth.js";
import { verifyRole } from "../middlewares/validateRole.js";
import {
  getAllOrder,
  getOrderById,
  getOrderHistory,
  placeOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

// CREATING ROUTES FOR "/order" REQUEST
const router = express.Router();
router.get("/", verifyToken, verifyRole("customer"), getOrderHistory);
router.post("/", verifyToken, verifyRole("customer"), placeOrder);
router.get("/all", verifyToken, verifyRole("admin"), getAllOrder);
router.get("/:id", verifyToken, verifyRole("customer"), getOrderById);
router.patch(
  "/:id/status",
  verifyToken,
  verifyRole("admin"),
  updateOrderStatus
);

export default router;
