import { Router } from "express";

import {
  createStationController,
  getAllStationsController,
  getStationByIdController,
  updateStationController,
  deleteStationController,
} from "../controllers/stationController";

const router = Router();

router.post(
  "/",
  createStationController
);

router.get(
  "/",
  getAllStationsController
);

router.get(
  "/:id",
  getStationByIdController
);

router.put(
  "/:id",
  updateStationController
);

router.delete(
  "/:id",
  deleteStationController
);

export default router;