import type { Alert } from "../types";

export const alerts: Alert[] = [
  {
    id: "ALT-001",
    stationId: "bharati",
    severity: "warning",
    title: "Generator B vibration trend",
    message:
      "Simulated vibration telemetry has exceeded the rolling baseline.",
    system: "Power Generation",
    timestamp: "19:42 IST",
    acknowledged: false,
  },
  {
    id: "ALT-002",
    stationId: "bharati",
    severity: "info",
    title: "Wind conditions increasing",
    message:
      "Forecast model indicates increasing wind speed during the next six hours.",
    system: "Environment",
    timestamp: "19:31 IST",
    acknowledged: true,
  },
  {
    id: "ALT-003",
    stationId: "maitri",
    severity: "info",
    title: "Energy demand increase",
    message:
      "Heating demand is projected to rise as external temperature decreases.",
    system: "Energy",
    timestamp: "19:18 IST",
    acknowledged: false,
  },
];