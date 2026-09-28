/*
 * POLARIS API SERVICE
 * ---------------------------------------------------------
 * Central API layer for the POLARIS Antarctic Digital Twin.
 *
 * Backend:
 * http://localhost:5001/api/v1
 *
 * Authentication:
 * JWT Bearer Token
 * ---------------------------------------------------------
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5001/api/v1";

const TOKEN_KEY = "polaris_token";
const USER_KEY = "polaris_user";

/* =========================================================
   TYPES
========================================================= */

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Station {
  id: string;
  name: string;
  code: string;
  description?: string;
  type?: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdById?: string | null;
}

export interface Infrastructure {
  id: string;
  name?: string;
  code?: string;
  type?: string;
  status?: string;
  stationId?: string;
  createdAt?: string;
  updatedAt?: string;
  station?: Station;
  [key: string]: unknown;
}

export interface Sensor {
  id: string;
  name: string;
  code: string;
  type: string;
  unit: string;
  status: string;
  stationId: string;
  createdAt?: string;
  updatedAt?: string;
  station?: Station;
}

export interface SensorReading {
  id: string;
  value: number;
  recordedAt: string;
  sensorId: string;
  createdAt?: string;
  sensor?: Sensor;
}

export interface Threshold {
  id: string;
  sensorId?: string;
  name?: string;
  type?: string;
  minValue?: number;
  maxValue?: number;
  warningMin?: number;
  warningMax?: number;
  criticalMin?: number;
  criticalMax?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface Alert {
  id: string;
  title?: string;
  message?: string;
  severity?: string;
  status?: string;
  stationId?: string;
  sensorId?: string;
  createdAt?: string;
  updatedAt?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  station?: Station;
  sensor?: Sensor;
  [key: string]: unknown;
}

export interface TelemetryReading {
  value: number;
  unit: string;
  recordedAt: string;
}

export interface DashboardInfrastructure {
  id: string;
  name: string;
  type: string;
  status: string;
}

export interface DashboardAlert {
  id: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  value?: number | null;
  triggeredAt: string;

  sensor?: {
    id: string;
    name: string;
    code: string;
    type: string;
    unit: string;
  };
}

export interface StationTelemetry {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: string;

  location: {
    latitude: number;
    longitude: number;
    elevation?: number | null;
  };

  active: boolean;

  statistics: {
    infrastructures: number;
    operationalInfrastructure: number;
    infrastructureAvailability: number;

    sensors: number;
    activeSensors: number;
    sensorAvailability: number;

    activeAlerts: number;
  };

  telemetry: {
    temperature?: TelemetryReading | null;
    humidity?: TelemetryReading | null;
    pressure?: TelemetryReading | null;
    windSpeed?: TelemetryReading | null;
    power?: TelemetryReading | null;
    fuelLevel?: TelemetryReading | null;
    waterLevel?: TelemetryReading | null;
  };

  infrastructures: DashboardInfrastructure[];
  alerts: DashboardAlert[];
}

export interface DashboardData {
  stations: number;
  infrastructures: number;
  sensors: number;
  activeSensors: number;
  activeAlerts: number;

  stationTelemetry: StationTelemetry[];

  recentReadings: SensorReading[];
}

/* =========================================================
   TOKEN MANAGEMENT
========================================================= */

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

/* =========================================================
   CORE REQUEST FUNCTION
========================================================= */

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("POLARIS API connection error:", error);

    throw new Error(
      "Unable to reach POLARIS backend. Make sure the backend is running on http://localhost:5001."
    );
  }

  if (response.status === 401) {
    removeToken();
    localStorage.removeItem(USER_KEY);

    throw new Error(
      "Authentication expired or invalid. Please login again."
    );
  }

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      `Backend returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    const errorResult = result as {
      message?: string;
      error?: string;
    };

    throw new Error(
      errorResult?.message ||
        errorResult?.error ||
        `API request failed with status ${response.status}`
    );
  }

  return result as T;
}

/* =========================================================
   HEALTH
========================================================= */

export function getHealth() {
  return request("/health");
}

/* =========================================================
   AUTHENTICATION
========================================================= */

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await request<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (response.success && response.data?.token) {
    setToken(response.data.token);

    if (response.data.user) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(response.data.user)
      );
    }
  }

  return response;
}

export function logout(): void {
  removeToken();
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): Promise<ApiResponse<User>> {
  return request<ApiResponse<User>>("/auth/me");
}

/* =========================================================
   DASHBOARD
========================================================= */

export function getDashboard(): Promise<ApiResponse<DashboardData>> {
  return request<ApiResponse<DashboardData>>("/dashboard");
}

/* =========================================================
   STATIONS
========================================================= */

export function getStations() {
  return request<ApiResponse<Station[]>>("/stations");
}

export function getStation(id: string) {
  return request<ApiResponse<Station>>(`/stations/${id}`);
}

export function createStation(
  data: Record<string, unknown>
) {
  return request("/stations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateStation(
  id: string,
  data: Record<string, unknown>
) {
  return request(`/stations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteStation(id: string) {
  return request(`/stations/${id}`, {
    method: "DELETE",
  });
}

/* =========================================================
   INFRASTRUCTURE
========================================================= */

export function getInfrastructures() {
  return request<ApiResponse<Infrastructure[]>>(
    "/infrastructures"
  );
}

export function getInfrastructure(id: string) {
  return request<ApiResponse<Infrastructure>>(
    `/infrastructures/${id}`
  );
}

export function createInfrastructure(
  data: Record<string, unknown>
) {
  return request("/infrastructures", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateInfrastructure(
  id: string,
  data: Record<string, unknown>
) {
  return request(`/infrastructures/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteInfrastructure(id: string) {
  return request(`/infrastructures/${id}`, {
    method: "DELETE",
  });
}

/* =========================================================
   SENSORS
========================================================= */

export function getSensors() {
  return request<ApiResponse<Sensor[]>>("/sensors");
}

export function getSensor(id: string) {
  return request<ApiResponse<Sensor>>(`/sensors/${id}`);
}

export function createSensor(
  data: Record<string, unknown>
) {
  return request("/sensors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSensor(
  id: string,
  data: Record<string, unknown>
) {
  return request(`/sensors/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteSensor(id: string) {
  return request(`/sensors/${id}`, {
    method: "DELETE",
  });
}

/* =========================================================
   SENSOR READINGS
========================================================= */

export function createSensorReading(
  data: Record<string, unknown>
) {
  return request("/sensor-readings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createBulkSensorReadings(
  data: Record<string, unknown>
) {
  return request("/sensor-readings/bulk", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getSensorReadings(
  sensorId: string
) {
  return request<ApiResponse<SensorReading[]>>(
    `/sensor-readings/sensor/${sensorId}`
  );
}

export function getLatestSensorReading(
  sensorId: string
) {
  return request<ApiResponse<SensorReading>>(
    `/sensor-readings/sensor/${sensorId}/latest`
  );
}

/* =========================================================
   THRESHOLDS
========================================================= */

export function getThresholds() {
  return request<ApiResponse<Threshold[]>>(
    "/thresholds"
  );
}

export function getThreshold(id: string) {
  return request<ApiResponse<Threshold>>(
    `/thresholds/${id}`
  );
}

export function createThreshold(
  data: Record<string, unknown>
) {
  return request("/thresholds", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateThreshold(
  id: string,
  data: Record<string, unknown>
) {
  return request(`/thresholds/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteThreshold(id: string) {
  return request(`/thresholds/${id}`, {
    method: "DELETE",
  });
}

/* =========================================================
   ALERTS
========================================================= */

export function getAlerts() {
  return request<ApiResponse<Alert[]>>("/alerts");
}

export function getActiveAlerts() {
  return request<ApiResponse<Alert[]>>(
    "/alerts/active"
  );
}

export function getStationAlerts(
  stationId: string
) {
  return request<ApiResponse<Alert[]>>(
    `/alerts/station/${stationId}`
  );
}

export function acknowledgeAlert(id: string) {
  return request(`/alerts/${id}/acknowledge`, {
    method: "PUT",
  });
}

export function resolveAlert(id: string) {
  return request(`/alerts/${id}/resolve`, {
    method: "PUT",
  });
}