import {
  createTrackingSession,
  findTrackingSession,
} from "../repositories/tracking.repository.js";

import { generateTrackingId } from "../utils/generateTrackingId.js";

export const createTrackingService = async (userId, expiryHours) => {
  const trackingId = generateTrackingId();

  // Expiry Time
  const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  const session = await createTrackingSession(trackingId, userId, expiresAt);

  return session;
};

export const getTrackingService = async (trackingId) => {
  if (new Date() > new Date(session.expires_at)) {
    throw new Error("Tracking link expired");
  }

  const session = await findTrackingSession(trackingId);

  if (!session) {
    throw new Error("Tracking session not found");
  }

  return session;
};
