import { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboardService";

export const getDashboardController = async (
  _req: Request,
  res: Response
) => {
  try {
    const data = await getDashboardStats();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};