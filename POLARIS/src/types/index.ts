export type StationId = "maitri" | "bharati";

export type SystemStatus =
  | "nominal"
  | "warning"
  | "critical"
  | "offline"
  | "maintenance";

export type DataSource =
  | "public-reference"
  | "simulated-telemetry"
  | "ai-forecast";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Station {
  id: StationId;
  name: string;
  code: string;
  country: string;
  region: string;
  coordinates: Coordinates;
  description: string;
  image: string;

  status: SystemStatus;

  environment: {
    temperature: number;
    feelsLike: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    humidity: number;
    visibility: number;
    condition: string;
  };

  energy: {
    demand: number;
    generation: number;
    generatorLoad: number;
    renewableContribution: number;
    fuelReserve: number;
    estimatedFuelDays: number;
  };

  infrastructure: {
    overallHealth: number;
    hvac: SystemStatus;
    electrical: SystemStatus;
    water: SystemStatus;
    communications: SystemStatus;
    generators: SystemStatus;
  };

  communications: {
    status: SystemStatus;
    latency: number;
    uplink: number;
    downlink: number;
  };

  logistics: {
    foodReserveDays: number;
    fuelReserveDays: number;
    medicalStock: number;
    criticalSpares: number;
  };
}

export interface TelemetryPoint {
  time: string;
  temperature: number;
  powerDemand: number;
  generation: number;
  fuelLevel: number;
}

export interface Alert {
  id: string;
  stationId: StationId;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  system: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface Equipment {
  id: string;
  stationId: StationId;
  name: string;
  category: string;
  status: SystemStatus;
  health: number;
  load?: number;
  temperature?: number;
  operatingHours?: number;
  nextMaintenance?: string;
}

export interface Resource {
  id: string;
  stationId: StationId;
  name: string;
  category: "fuel" | "food" | "medical" | "spares" | "water";
  current: number;
  capacity: number;
  unit: string;
  dailyConsumption?: number;
}

export interface Prediction {
  id: string;
  stationId: StationId;
  type: "energy" | "weather" | "equipment" | "logistics";
  title: string;
  confidence: number;
  horizon: string;
  description: string;
  recommendation: string;
  risk: "low" | "medium" | "high";
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: "weather" | "energy" | "equipment" | "communications";
  severity: "moderate" | "severe" | "extreme";
}