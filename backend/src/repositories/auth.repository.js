import { pool } from "../config/db.js";

export const findUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};
export const findUserById = async (id) => {
  const query = `
    SELECT id, name, username, email
    FROM users
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};
export const createUser = async ({
  name,
  username,
  email,
  password,
}) => {
  const query = `
    INSERT INTO users(name, username, email, password)
    VALUES($1, $2, $3, $4)
    RETURNING id, name, username, email
  `;

  const values = [name, username, email, password];

  const result = await pool.query(query, values);

  return result.rows[0];
};