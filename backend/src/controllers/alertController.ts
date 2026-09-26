import { Request, Response } from "express";

import {
  getAllAlerts,
  getActiveAlerts,
  getAlertsByStation,
  acknowledgeAlert,
  resolveAlert,
} from "../services/alertService";


// GET ALL ALERTS
export const getAllAlertsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const alerts = await getAllAlerts();

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Get all alerts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
    });
  }
};


// GET ACTIVE ALERTS
export const getActiveAlertsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const alerts = await getActiveAlerts();

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Get active alerts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active alerts",
    });
  }
};


// GET ALERTS BY STATION
export const getAlertsByStationController = async (
  req: Request,
  res: Response
) => {
  try {
    const stationId = req.params.stationId;

    if (typeof stationId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid station ID",
      });
    }

    const alerts = await getAlertsByStation(stationId);

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Get station alerts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch station alerts",
    });
  }
};


// ACKNOWLEDGE ALERT
export const acknowledgeAlertController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const alert = await acknowledgeAlert(id);

    return res.status(200).json({
      success: true,
      message: "Alert acknowledged successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Acknowledge alert error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to acknowledge alert";

    if (message === "Alert not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }
};


// RESOLVE ALERT
export const resolveAlertController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const alert = await resolveAlert(id);

    return res.status(200).json({
      success: true,
      message: "Alert resolved successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Resolve alert error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to resolve alert";

    if (message === "Alert not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }
};