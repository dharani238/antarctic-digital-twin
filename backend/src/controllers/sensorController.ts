import { Request, Response } from "express";

import {
  createSensor,
  getSensorsByStation,
  getSensorById,
  updateSensor,
  deleteSensor,
} from "../services/sensorService";

import {
  createSensorSchema,
  updateSensorSchema,
} from "../validators/sensorValidator";


// CREATE SENSOR
export const createSensorController = async (
  req: Request,
  res: Response
) => {
  try {
    const validation =
      createSensorSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten(),
      });
    }

    const sensor = await createSensor(
      validation.data
    );

    return res.status(201).json({
      success: true,
      message: "Sensor created successfully",
      data: sensor,
    });
  } catch (error) {
    console.error("Create sensor error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create sensor";

    if (
      message === "Station not found" ||
      message === "Sensor code already exists"
    ) {
      return res.status(
        message === "Station not found" ? 404 : 409
      ).json({
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


// GET SENSORS BY STATION
export const getSensorsByStationController =
  async (
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

      const sensors =
        await getSensorsByStation(stationId);

      return res.status(200).json({
        success: true,
        count: sensors.length,
        data: sensors,
      });
    } catch (error) {
      console.error("Get sensors error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch sensors";

      if (message === "Station not found") {
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


// GET SENSOR BY ID
export const getSensorByIdController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid sensor ID",
        });
      }

      const sensor = await getSensorById(id);

      if (!sensor) {
        return res.status(404).json({
          success: false,
          message: "Sensor not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: sensor,
      });
    } catch (error) {
      console.error("Get sensor error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch sensor",
      });
    }
  };


// UPDATE SENSOR
export const updateSensorController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid sensor ID",
        });
      }

      const validation =
        updateSensorSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        });
      }

      const sensor = await updateSensor(
        id,
        validation.data
      );

      return res.status(200).json({
        success: true,
        message: "Sensor updated successfully",
        data: sensor,
      });
    } catch (error) {
      console.error("Update sensor error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update sensor";

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


// DELETE SENSOR
export const deleteSensorController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid sensor ID",
        });
      }

      await deleteSensor(id);

      return res.status(200).json({
        success: true,
        message: "Sensor deleted successfully",
      });
    } catch (error) {
      console.error("Delete sensor error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete sensor";

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