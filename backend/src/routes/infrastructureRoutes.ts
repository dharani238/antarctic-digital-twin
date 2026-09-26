import { Router } from "express";

import {
  createInfrastructureController,
  getInfrastructureByStationController,
  getInfrastructureByIdController,
  updateInfrastructureController,
  deleteInfrastructureController,
} from "../controllers/infrastructureController";

const router = Router();


// Create infrastructure
router.post(
  "/",
  createInfrastructureController
);


// Get infrastructure belonging to a station
router.get(
  "/station/:stationId",
  getInfrastructureByStationController
);


// Get infrastructure by ID
router.get(
  "/:id",
  getInfrastructureByIdController
);


// Update infrastructure
router.put(
  "/:id",
  updateInfrastructureController
);


// Delete infrastructure
router.delete(
  "/:id",
  deleteInfrastructureController
);

export default router;