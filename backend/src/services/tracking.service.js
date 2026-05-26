import {
  createTrackingSession,
  findTrackingSession,
} from "../repositories/tracking.repository.js";

import { generateTrackingId }
from "../utils/generateTrackingId.js";

export const createTrackingService =
  async (userId) => {

    const trackingId =
      generateTrackingId();

    const session =
      await createTrackingSession(
        trackingId,
        userId
      );

    return session;
};

export const getTrackingService =
  async (trackingId) => {

    const session =
      await findTrackingSession(
        trackingId
      );

    if (!session) {
      throw new Error(
        "Tracking session not found"
      );
    }

    return session;
};