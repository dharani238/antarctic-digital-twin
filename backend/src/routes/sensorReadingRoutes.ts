import { Router } from "express";

import {
  createSensorReadingController,
  createSensorReadingsBulkController,
  getSensorReadingsController,
  getLatestSensorReadingController,
} from "../controllers/sensorReadingController";

const router = Router();


// =====================================================
// CREATE SINGLE READING
// POST /api/v1/sensor-readings
// =====================================================

router.post(
  "/",
  createSensorReadingController
);


// =====================================================
// CREATE BULK READINGS
// POST /api/v1/sensor-readings/bulk
// =====================================================

router.post(
  "/bulk",
  createSensorReadingsBulkController
);


// =====================================================
// GET SENSOR READINGS
// GET /api/v1/sensor-readings/sensor/:sensorId
// =====================================================

router.get(
  "/sensor/:sensorId",
  getSensorReadingsController
);


// =====================================================
// GET LATEST READING
// GET /api/v1/sensor-readings/sensor/:sensorId/latest
// =====================================================

router.get(
  "/sensor/:sensorId/latest",
  getLatestSensorReadingController
);


export default router;