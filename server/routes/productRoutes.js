import { Router } from "express";
import { verifyAuth } from "../middlewares/authMiddleware.js";
import { getProductById, createProduct, updateProduct, deleteProduct, getAllProducts } from "../controllers/productController.js";
import { createProductValidator, updateProductValidator } from "../middlewares/productValidator.js";
import { handleValidation } from "../middlewares/expressValidator.js";

export const productRoutes = Router();

productRoutes.get("/getproducts", verifyAuth, getAllProducts);
productRoutes.get("/getproduct/:id", verifyAuth, getProductById);
productRoutes.post("/createproduct", verifyAuth, createProductValidator, handleValidation, createProduct);
productRoutes.put("/updateproduct/:id", verifyAuth, updateProductValidator, handleValidation, updateProduct);
productRoutes.delete("/deleteproduct/:id", verifyAuth, deleteProduct);
