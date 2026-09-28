import { Router } from "express";

import {
  registerController,
  loginController,
  meController,
} from "../controllers/authController";

import {
  authenticate,
} from "../middleware/authMiddleware";

const router = Router();


// REGISTER
router.post(
  "/register",
  registerController
);


// LOGIN
router.post(
  "/login",
  loginController
);


// CURRENT USER
router.get(
  "/me",
  authenticate,
  meController
);

export default router;