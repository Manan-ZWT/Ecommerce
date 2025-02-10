// IMPORTING REQUIRED MODULES AND FILES
import express from "express";
import { verifyToken } from "../middlewares/jwtAuth.js";
import { verifyRole } from "../middlewares/validateRole.js";
import { addtoWishlist, showWishlist, deleteFromWishlist } from "../controllers/wishlistController.js";

// CREATING ROUTES FOR "/wishlist" REQUEST
const router = express.Router();
router.get("/", verifyToken, verifyRole("customer"), showWishlist);
router.post("/", verifyToken, verifyRole("customer"), addtoWishlist);
router.delete("/:id", verifyToken, verifyRole("customer"), deleteFromWishlist );

export default router;
