import express from "express";

import {
  registerController,
  loginController,
  getCurrentUserController
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", registerController);
router.get("/me", authMiddleware, getCurrentUserController);

router.post("/login", loginController);

export default router;
