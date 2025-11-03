import { Router } from "express";
import { getUsers, createUser, loginUser, logoutUser, getLoggedInfo } from "../controllers/userController.js";
import { createUserValidator, loginUserValidator } from "../middlewares/userValidator.js";
import { handleValidation } from "../middlewares/expressValidator.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";

export const userRoutes = Router();

userRoutes.post("/register", createUserValidator, handleValidation, createUser);
userRoutes.post("/login", loginUserValidator, handleValidation, loginUser);

userRoutes.get("/getusers", verifyAuth, getUsers);
userRoutes.post("/logout", verifyAuth, logoutUser);
// userRoutes.get("/logged", getLoggedInfo);
