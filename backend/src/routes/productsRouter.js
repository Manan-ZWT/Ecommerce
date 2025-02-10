// IMPORTING REQUIRED MODULES AND FILES
import express from "express";
import { verifyToken } from "../middlewares/jwtAuth.js";
import { verifyRole } from "../middlewares/validateRole.js";
import { checkFile } from "../middlewares/fileCheck.js";
import {
  addNewProduct,
  deleteProduct,
  showAllProducts,
  showProductById,
  updateProduct,
} from "../controllers/productsController.js";

// CREATING ROUTES FOR "/product" REQUEST
const router = express.Router();
router.get("/", showAllProducts);
router.post("/", verifyToken, verifyRole("admin"), checkFile, addNewProduct);
router.get("/:id", showProductById);
router.patch(
  "/:id",
  verifyToken,
  verifyRole("admin"),
  checkFile,
  updateProduct
);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteProduct);

export default router;
