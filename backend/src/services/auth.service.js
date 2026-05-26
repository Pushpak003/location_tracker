import bcrypt from "bcrypt";

import {
  createUser,
  findUserByEmail,findUserById,
} from "../repositories/auth.repository.js";

import { generateToken } from "../utils/jwt.js";

export const registerService = async (data) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await createUser({
    ...data,
    password: hashedPassword,
  });

  return user;
};
export const getCurrentUserService = async (
  userId
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatched) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    },
  };
};