import { Request, Response } from "express";

import {
  createSensorReading,
  createSensorReadingsBulk,
  getSensorReadings,
  getLatestSensorReading,
} from "../services/sensorReadingService";

import {
  createSensorReadingSchema,
} from "../validators/sensorReadingValidator";


// =====================================================
// CREATE SINGLE SENSOR READING
// =====================================================

export const createSensorReadingController = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = createSensorReadingSchema.safeParse(
      req.body
    );

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten(),
      });
    }

    const result = await createSensorReading(
      validation.data
    );

    return res.status(201).json({
      success: true,
      message: "Sensor reading created successfully",
      data: result.reading,
      alerts: result.alerts,
    });

  } catch (error) {
    console.error(
      "Create sensor reading error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create sensor reading";

    if (message === "Sensor not found") {
      return res.status(404).json({
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


// =====================================================
// CREATE BULK SENSOR READINGS
// =====================================================

export const createSensorReadingsBulkController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const body = req.body;

      if (!Array.isArray(body)) {
        return res.status(400).json({
          success: false,
          message: "Request body must be an array",
        });
      }

      const validations = body.map((item) =>
        createSensorReadingSchema.safeParse(item)
      );

      const invalid = validations.find(
        (result) => !result.success
      );

      if (invalid && !invalid.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: invalid.error.flatten(),
        });
      }

      const readings = validations.map((result) => {
        if (!result.success) {
          throw new Error("Validation failed");
        }

        return result.data;
      });

      const result =
        await createSensorReadingsBulk(readings);

      return res.status(201).json({
        success: true,
        message:
          "Sensor readings created successfully",
        count: result.count,
        data: result.data,
      });

    } catch (error) {
      console.error(
        "Bulk sensor reading error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to create readings";

      if (message.startsWith("Sensor not found")) {
        return res.status(404).json({
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


// =====================================================
// GET SENSOR READINGS
// =====================================================

export const getSensorReadingsController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const sensorId = req.params.sensorId;

      if (typeof sensorId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid sensor ID",
        });
      }

      const fromParam = req.query.from;
      const toParam = req.query.to;

      const from =
        typeof fromParam === "string"
          ? new Date(fromParam)
          : undefined;

      const to =
        typeof toParam === "string"
          ? new Date(toParam)
          : undefined;

      if (
        (from && isNaN(from.getTime())) ||
        (to && isNaN(to.getTime()))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }

      const readings =
        await getSensorReadings(
          sensorId,
          from,
          to
        );

      return res.status(200).json({
        success: true,
        count: readings.length,
        data: readings,
      });

    } catch (error) {
      console.error(
        "Get sensor readings error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch readings";

      if (message === "Sensor not found") {
        return res.status(404).json({
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


// =====================================================
// GET LATEST SENSOR READING
// =====================================================

export const getLatestSensorReadingController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const sensorId = req.params.sensorId;

      if (typeof sensorId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid sensor ID",
        });
      }

      const reading =
        await getLatestSensorReading(sensorId);

      if (!reading) {
        return res.status(404).json({
          success: false,
          message: "No readings found",
        });
      }

      return res.status(200).json({
        success: true,
        data: reading,
      });

    } catch (error) {
      console.error(
        "Latest reading error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch latest reading";

      if (message === "Sensor not found") {
        return res.status(404).json({
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