import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const JWT_SECRET =
  process.env.JWT_SECRET || "antarctic-digital-twin-secret";

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || "1d";

/* =========================================================
   REGISTER USER
========================================================= */

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "OPERATOR" | "VIEWER" = "VIEWER"
) => {
  // Normalize email so login and registration use the same format
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    },
  });

  console.log("REGISTER SUCCESS:", {
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

/* =========================================================
   LOGIN USER
========================================================= */

export const loginUser = async (
  email: string,
  password: string
) => {
  // Use exactly the same email normalization as registration
  const normalizedEmail = email.trim().toLowerCase();

  console.log("LOGIN ATTEMPT:", normalizedEmail);

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  // TEMPORARY DEBUG MESSAGE
  if (!user) {
    console.log(
      "LOGIN FAILED: User not found:",
      normalizedEmail
    );

    throw new Error(
      "DEBUG: User not found in database"
    );
  }

  console.log("LOGIN USER FOUND:", {
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  // TEMPORARY DEBUG MESSAGE
  if (!passwordMatch) {
    console.log(
      "LOGIN FAILED: Password does not match for:",
      normalizedEmail
    );

    throw new Error(
      "DEBUG: User exists but password does not match"
    );
  }

  console.log(
    "LOGIN PASSWORD VERIFIED:",
    normalizedEmail
  );

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

/* =========================================================
   GET CURRENT USER
========================================================= */

export const getCurrentUser = async (
  userId: string
) => {
  const user = await prisma.user.findUnique({
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