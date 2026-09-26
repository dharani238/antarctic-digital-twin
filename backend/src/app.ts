import express from "express";
import cors from "cors";
import infrastructureRoutes from "./routes/infrastructureRoutes";
import stationRoutes from "./routes/stationRoutes";
import sensorRoutes from "./routes/sensorRoutes";
import sensorReadingRoutes from "./routes/sensorReadingRoutes";
import thresholdRoutes from "./routes/thresholdRoutes";
import alertRoutes from "./routes/alertRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import authRoutes from "./routes/authRoutes";
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get(
  "/api/v1/health",
  (_req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Antarctic Digital Twin API is running",
      timestamp: new Date().toISOString(),
    });
  }
);

app.use(
  "/api/v1/stations",
  stationRoutes
);
app.use(
  "/api/v1/infrastructures",
  infrastructureRoutes
);
app.use(
  "/api/v1/sensors",
  sensorRoutes
);

app.use(
  "/api/v1/sensor-readings",
  sensorReadingRoutes
);
app.use(
  "/api/v1/thresholds",
  thresholdRoutes
);
app.use(
  "/api/v1/alerts",
  alertRoutes
);
app.use(
  "/api/v1/dashboard",
  dashboardRoutes
);
app.use(
  "/api/v1/auth",
  authRoutes
);
app.use(
  (
    _req,
    res
  ) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
    });
  }
);

app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

export default app;