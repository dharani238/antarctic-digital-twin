import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "antarctic-digital-twin-secret";

export interface AuthenticatedRequest
  extends Request {
  user?: {
    userId: string;
    email: string;
    role: "ADMIN" | "OPERATOR" | "VIEWER";
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {

  try {

    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    if (
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token =
      authorization.substring(7);

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      ) as AuthenticatedRequest["user"];

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};