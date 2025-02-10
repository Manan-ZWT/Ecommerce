// IMPORTING REQUIRED MODULES AND FILES
import express from "express";
import { verifyToken } from "../middlewares/jwtAuth.js";
import { verifyRole } from "../middlewares/validateRole.js";
import {
  getAllUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../controllers/usersController.js";

// CREATING ROUTES FOR "/user" REQUEST
const router = express.Router();
router.get(
  "/profile",
  verifyToken,
  verifyRole("admin", "customer"),
  getUserProfile
);
router.put(
  "/profile",
  verifyToken,
  verifyRole("admin", "customer"),
  updateUserProfile
);
router.get("/", verifyToken, verifyRole("admin"), getAllUserProfile);

export default router;
