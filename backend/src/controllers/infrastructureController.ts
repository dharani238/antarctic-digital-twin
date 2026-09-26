import { Request, Response } from "express";

import {
  createInfrastructure,
  getInfrastructureByStation,
  getInfrastructureById,
  updateInfrastructure,
  deleteInfrastructure,
} from "../services/infrastructureService";

import {
  createInfrastructureSchema,
  updateInfrastructureSchema,
} from "../validators/infrastructureValidator";


// CREATE INFRASTRUCTURE
export const createInfrastructureController = async (
  req: Request,
  res: Response
) => {
  try {
    const validation =
      createInfrastructureSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten(),
      });
    }

    const infrastructure =
      await createInfrastructure(validation.data);

    return res.status(201).json({
      success: true,
      message: "Infrastructure created successfully",
      data: infrastructure,
    });
  } catch (error) {
    console.error(
      "Create infrastructure error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create infrastructure";

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


// GET INFRASTRUCTURE BY STATION
export const getInfrastructureByStationController =
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

      const infrastructure =
        await getInfrastructureByStation(
          stationId
        );

      return res.status(200).json({
        success: true,
        count: infrastructure.length,
        data: infrastructure,
      });
    } catch (error) {
      console.error(
        "Get station infrastructure error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch infrastructure";

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


// GET INFRASTRUCTURE BY ID
export const getInfrastructureByIdController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid infrastructure ID",
        });
      }

      const infrastructure =
        await getInfrastructureById(id);

      if (!infrastructure) {
        return res.status(404).json({
          success: false,
          message: "Infrastructure not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: infrastructure,
      });
    } catch (error) {
      console.error(
        "Get infrastructure error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch infrastructure",
      });
    }
  };


// UPDATE INFRASTRUCTURE
export const updateInfrastructureController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid infrastructure ID",
        });
      }

      const validation =
        updateInfrastructureSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        });
      }

      const infrastructure =
        await updateInfrastructure(
          id,
          validation.data
        );

      return res.status(200).json({
        success: true,
        message:
          "Infrastructure updated successfully",
        data: infrastructure,
      });
    } catch (error) {
      console.error(
        "Update infrastructure error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update infrastructure";

      if (message === "Infrastructure not found") {
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


// DELETE INFRASTRUCTURE
export const deleteInfrastructureController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid infrastructure ID",
        });
      }

      await deleteInfrastructure(id);

      return res.status(200).json({
        success: true,
        message:
          "Infrastructure deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete infrastructure error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete infrastructure";

      if (message === "Infrastructure not found") {
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