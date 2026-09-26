import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/authService";

import {
  registerSchema,
  loginSchema,
} from "../validators/authValidator";


// REGISTER
export const registerController = async (
  req: Request,
  res: Response
) => {

  try {

    const validation =
      registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors:
          validation.error.flatten(),
      });
    }

    const {
      name,
      email,
      password,
      role,
    } = validation.data;

    const user =
      await registerUser(
        name,
        email,
        password,
        role
      );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });

  } catch (error) {

    console.error(
      "Register error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Registration failed";

    if (
      message ===
      "User with this email already exists"
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
};


// LOGIN
export const loginController = async (
  req: Request,
  res: Response
) => {

  try {

    const validation =
      loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors:
          validation.error.flatten(),
      });
    }

    const {
      email,
      password,
    } = validation.data;

    const result =
      await loginUser(
        email,
        password
      );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Login failed";

    if (
      message ===
      "Invalid email or password"
    ) {
      return res.status(401).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
};


// CURRENT USER
export const meController = async (
  req: Request,
  res: Response
) => {

  try {

    const userId =
      (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user =
      await getCurrentUser(userId);

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {

    console.error(
      "Get current user error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to get user";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};