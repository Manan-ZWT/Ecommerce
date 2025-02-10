// IMPORTING REQUIRED MODULES AND FILES
import express from "express";
import {
  registerNewUser,
  userLogin,
} from "../controllers/userAuthController.js";

// CREATING ROUTES FOR "/auth" REQUEST
const router = express.Router();
router.post("/registration", registerNewUser);
router.post("/login", userLogin);

export default router;
