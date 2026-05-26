import { pool } from "../config/db.js";

export const createTrackingSession =
  async (
    trackingId,
    userId
  ) => {

    const query = `
      INSERT INTO tracking_sessions(
        tracking_id,
        user_id
      )
      VALUES($1, $2)
      RETURNING *
    `;

    const result = await pool.query(
      query,
      [trackingId, userId]
    );

    return result.rows[0];
};

export const findTrackingSession =
  async (trackingId) => {

    const query = `
      SELECT *
      FROM tracking_sessions
      WHERE tracking_id = $1
    `;

    const result = await pool.query(
      query,
      [trackingId]
    );

    return result.rows[0];
};