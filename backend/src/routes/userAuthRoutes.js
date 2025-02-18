// IMPORTING REQUIRED MODULES AND FILES
import express from "express";
import {
  forgetPassword,
  registerNewUser,
  resetPassword,
  userLogin,
} from "../controllers/userAuthController.js";

// CREATING ROUTES FOR "/auth" REQUEST
const router = express.Router();
router.post("/registration", registerNewUser);
router.post("/login", userLogin);
router.post("/forget", forgetPassword);
router.patch("/reset", resetPassword);

export default router;
