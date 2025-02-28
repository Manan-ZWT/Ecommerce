// IMPORTING REQUIRED MODULES AND FILES
import express from "express";
import {
  forgetPassword,
  loggedInUser,
  logout,
  registerNewUser,
  resetPassword,
  userLogin,
} from "../controllers/userAuthController.js";
import { verifyToken } from "../middlewares/jwtAuth.js";

// CREATING ROUTES FOR "/auth" REQUEST
const router = express.Router();
router.post("/registration", registerNewUser);
router.post("/login", userLogin);
router.get("/logged", loggedInUser);
router.post("/forget", forgetPassword);
router.patch("/reset", resetPassword);
router.post("/logout", logout);


export default router;
