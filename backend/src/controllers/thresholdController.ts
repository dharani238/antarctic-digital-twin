import { Request, Response } from "express";

import {
  createThreshold,
  getThresholds,
  getThresholdsBySensor,
  getThresholdById,
  updateThreshold,
  deleteThreshold,
} from "../services/thresholdService";

import {
  createThresholdSchema,
  updateThresholdSchema,
} from "../validators/thresholdValidator";


// CREATE
export const createThresholdController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const validation =
        createThresholdSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        });
      }

      const threshold =
        await createThreshold(
          validation.data
        );

      return res.status(201).json({
        success: true,
        message:
          "Threshold created successfully",
        data: threshold,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create threshold";

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


// GET ALL
export const getThresholdsController =
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const thresholds =
        await getThresholds();

      return res.status(200).json({
        success: true,
        count: thresholds.length,
        data: thresholds,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch thresholds",
      });
    }
  };


// GET BY SENSOR
export const getThresholdsBySensorController =
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

      const thresholds =
        await getThresholdsBySensor(
          sensorId
        );

      return res.status(200).json({
        success: true,
        count: thresholds.length,
        data: thresholds,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch thresholds";

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


// GET BY ID
export const getThresholdByIdController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid threshold ID",
        });
      }

      const threshold =
        await getThresholdById(id);

      if (!threshold) {
        return res.status(404).json({
          success: false,
          message: "Threshold not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: threshold,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch threshold",
      });
    }
  };


// UPDATE
export const updateThresholdController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid threshold ID",
        });
      }

      const validation =
        updateThresholdSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        });
      }

      const threshold =
        await updateThreshold(
          id,
          validation.data
        );

      return res.status(200).json({
        success: true,
        message:
          "Threshold updated successfully",
        data: threshold,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update threshold";

      if (message === "Threshold not found") {
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


// DELETE
export const deleteThresholdController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid threshold ID",
        });
      }

      await deleteThreshold(id);

      return res.status(200).json({
        success: true,
        message:
          "Threshold deleted successfully",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete threshold";

      if (message === "Threshold not found") {
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