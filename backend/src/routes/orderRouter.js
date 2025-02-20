// IMPORTING REQUIRED MODULES AND FILES
import express from "express";
import { verifyToken } from "../middlewares/jwtAuth.js";
import { verifyRole } from "../middlewares/validateRole.js";
import { placeOrderCheck } from "../middlewares/orderCheck.js";
import {
  getAllOrder,
  getOrderById,
  getOrderHistory,
  payOrder,
  placeOrder,
  updateOrderStatus,
  verifyPayment,
} from "../controllers/orderController.js";

// CREATING ROUTES FOR "/order" REQUEST
const router = express.Router();
router.get("/", verifyToken, verifyRole("customer"), getOrderHistory);
router.post(
  "/",
  verifyToken,
  verifyRole("customer"),
  placeOrderCheck,
  payOrder
);
router.post("/verify", verifyPayment);
router.post("/confirm", placeOrder);
router.get("/all", verifyToken, verifyRole("admin"), getAllOrder);
router.get("/:id", verifyToken, verifyRole("customer"), getOrderById);
router.patch(
  "/:id/status",
  verifyToken,
  verifyRole("admin"),
  updateOrderStatus
);

export default router;
