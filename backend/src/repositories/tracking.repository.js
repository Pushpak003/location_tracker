import { pool } from "../config/db.js";

export const createTrackingSession =
  async (
    trackingId,
    userId,
    expiresAt
  ) => {

    const query = `
      INSERT INTO tracking_sessions(
        tracking_id,
        user_id,
        expires_at
      )
      VALUES($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(
      query,
      [trackingId, userId, expiresAt]
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