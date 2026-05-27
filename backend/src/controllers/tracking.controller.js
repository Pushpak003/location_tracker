import {
  createTrackingService,
  getTrackingService,
} from "../services/tracking.service.js";

export const createTrackingController =
  async (req, res) => {

    try {

      const session =
        await createTrackingService(
          req.user.id,
          req.body.expiryHours
        );

      res.status(201).json({
        success: true,
        session,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }
};

export const getTrackingController =
  async (req, res) => {

    try {

      const session =
        await getTrackingService(
          req.params.trackingId
        );

      res.status(200).json({
        success: true,
        session,
      });

    } catch (error) {

      res.status(404).json({
        success: false,
        message: error.message,
      });

    }
};