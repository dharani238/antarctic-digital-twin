import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const JWT_SECRET =
  process.env.JWT_SECRET || "antarctic-digital-twin-secret";

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || "1d";


// REGISTER USER
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "OPERATOR" | "VIEWER" = "VIEWER"
) => {

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error(
      "User with this email already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};


// LOGIN USER
export const loginUser = async (
  email: string,
  password: string
) => {

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const passwordMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatch) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN as any,
    }
  );

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};


// GET CURRENT USER
export const getCurrentUser = async (
  userId: string
) => {

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};