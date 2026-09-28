import { Router } from "express";

import {
  createSensorController,
  getSensorsByStationController,
  getSensorByIdController,
  updateSensorController,
  deleteSensorController,
} from "../controllers/sensorController";

const router = Router();

router.post(
  "/",
  createSensorController
);

router.get(
  "/station/:stationId",
  getSensorsByStationController
);

router.get(
  "/:id",
  getSensorByIdController
);

router.put(
  "/:id",
  updateSensorController
);

router.delete(
  "/:id",
  deleteSensorController
);

export default router;