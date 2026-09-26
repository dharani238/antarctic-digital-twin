import { Request, Response } from "express";

import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} from "../services/stationService";

import {
  createStationSchema,
  updateStationSchema,
} from "../validators/stationValidator";


// CREATE STATION
export const createStationController = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = createStationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten(),
      });
    }

    const station = await createStation(validation.data);

    return res.status(201).json({
      success: true,
      message: "Station created successfully",
      data: station,
    });
  } catch (error) {
    console.error("Create station error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create station",
    });
  }
};


// GET ALL STATIONS
export const getAllStationsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const stations = await getAllStations();

    return res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (error) {
    console.error("Get stations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stations",
    });
  }
};


// GET STATION BY ID
export const getStationByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid station ID",
      });
    }

    const station = await getStationById(id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: station,
    });
  } catch (error) {
    console.error("Get station error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch station",
    });
  }
};


// UPDATE STATION
export const updateStationController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid station ID",
      });
    }

    const validation = updateStationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten(),
      });
    }

    const station = await updateStation(
      id,
      validation.data
    );

    return res.status(200).json({
      success: true,
      message: "Station updated successfully",
      data: station,
    });
  } catch (error) {
    console.error("Update station error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update station";

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


// DELETE STATION
export const deleteStationController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid station ID",
      });
    }

    await deleteStation(id);

    return res.status(200).json({
      success: true,
      message: "Station deleted successfully",
    });
  } catch (error) {
    console.error("Delete station error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete station";

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