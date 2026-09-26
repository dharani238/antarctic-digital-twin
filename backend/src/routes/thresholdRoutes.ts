import { Router } from "express";

import {
  createThresholdController,
  getThresholdsController,
  getThresholdsBySensorController,
  getThresholdByIdController,
  updateThresholdController,
  deleteThresholdController,
} from "../controllers/thresholdController";

const router = Router();

router.post(
  "/",
  createThresholdController
);

router.get(
  "/",
  getThresholdsController
);

router.get(
  "/sensor/:sensorId",
  getThresholdsBySensorController
);

router.get(
  "/:id",
  getThresholdByIdController
);

router.put(
  "/:id",
  updateThresholdController
);

router.delete(
  "/:id",
  deleteThresholdController
);

export default router;