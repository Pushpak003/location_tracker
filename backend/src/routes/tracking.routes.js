import express from "express";

import {
  createTrackingController,
  getTrackingController,
} from "../controllers/tracking.controller.js";

import { authMiddleware }
from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create Tracking Session
router.post(
  "/create",
  authMiddleware,
  createTrackingController
);

// Get Tracking Session
router.get(
  "/:trackingId",
  getTrackingController
);

export default router;