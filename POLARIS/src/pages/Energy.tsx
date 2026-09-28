import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  BatteryCharging,
  Fuel,
  Gauge,
  Leaf,
  ShieldCheck,
  Sun,
  Thermometer,
  Zap,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { stations } from "../data/stations";
import { telemetry } from "../data/telemetry";
import { useStation } from "../context/StationContext";

import {
  getSensorReadings,
  getStations,
  type Sensor,
  type SensorReading,
  type Station,
} from "../services/api";

/* =========================================================
   BACKEND STATION TYPE
========================================================= */

type BackendStation = Station & {
  sensors?: Sensor[];
  infrastructures?: unknown[];
};

/* =========================================================
   ENERGY
========================================================= */

export default function Energy() {
  const { stationId, setStationId } = useStation();

  const [backendStations, setBackendStations] = useState<
    BackendStation[]
  >([]);

  const [powerReadings, setPowerReadings] = useState<
    SensorReading[]
  >([]);

  const [fuelReadings, setFuelReadings] = useState<
    SensorReading[]
  >([]);

  const [solarReadings, setSolarReadings] = useState<
    SensorReading[]
  >([]);

  const [temperatureReadings, setTemperatureReadings] = useState<
    SensorReading[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  /* =========================================================
     LOAD BACKEND STATIONS + SENSORS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadEnergyData() {
      try {
        setLoading(true);
        setApiError(null);

        const response = await getStations();

        if (!mounted) return;

        const data = (response.data ?? []) as BackendStation[];

        setBackendStations(data);
      } catch (error) {
        if (!mounted) return;

        setApiError(
          error instanceof Error
            ? error.message
            : "Unable to connect to backend"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadEnergyData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     FIND SELECTED BACKEND STATION
  ========================================================= */

  const backendStation = useMemo(() => {
    return backendStations.find(
      (station) =>
        station.code?.toLowerCase() === stationId ||
        station.name?.toLowerCase().includes(stationId)
    );
  }, [backendStations, stationId]);

  /* =========================================================
     FIND ENERGY SENSORS
  ========================================================= */

  const sensors = backendStation?.sensors ?? [];

  const powerSensor = sensors.find(
    (sensor) => sensor.type === "POWER"
  );

  const fuelSensor = sensors.find(
    (sensor) => sensor.type === "FUEL_LEVEL"
  );

  const solarSensor = sensors.find(
    (sensor) => sensor.type === "SOLAR_RADIATION"
  );

  const temperatureSensor = sensors.find(
    (sensor) => sensor.type === "TEMPERATURE"
  );

  /* =========================================================
     LOAD SENSOR READINGS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadReadings() {
      if (!backendStation) {
        setPowerReadings([]);
        setFuelReadings([]);
        setSolarReadings([]);
        setTemperatureReadings([]);
        return;
      }

      try {
        const requests: Promise<unknown>[] = [];

        if (powerSensor?.id) {
          requests.push(getSensorReadings(powerSensor.id));
        } else {
          requests.push(Promise.resolve(null));
        }

        if (fuelSensor?.id) {
          requests.push(getSensorReadings(fuelSensor.id));
        } else {
          requests.push(Promise.resolve(null));
        }

        if (solarSensor?.id) {
          requests.push(getSensorReadings(solarSensor.id));
        } else {
          requests.push(Promise.resolve(null));
        }

        if (temperatureSensor?.id) {
          requests.push(
            getSensorReadings(temperatureSensor.id)
          );
        } else {
          requests.push(Promise.resolve(null));
        }

        const [
          powerResponse,
          fuelResponse,
          solarResponse,
          temperatureResponse,
        ] = await Promise.all(requests);

        if (!mounted) return;

        const powerData =
          powerResponse &&
          typeof powerResponse === "object" &&
          "data" in powerResponse
            ? ((powerResponse as {
                data?: SensorReading[];
              }).data ?? [])
            : [];

        const fuelData =
          fuelResponse &&
          typeof fuelResponse === "object" &&
          "data" in fuelResponse
            ? ((fuelResponse as {
                data?: SensorReading[];
              }).data ?? [])
            : [];

        const solarData =
          solarResponse &&
          typeof solarResponse === "object" &&
          "data" in solarResponse
            ? ((solarResponse as {
                data?: SensorReading[];
              }).data ?? [])
            : [];

        const temperatureData =
          temperatureResponse &&
          typeof temperatureResponse === "object" &&
          "data" in temperatureResponse
            ? ((temperatureResponse as {
                data?: SensorReading[];
              }).data ?? [])
            : [];

        setPowerReadings(powerData);
        setFuelReadings(fuelData);
        setSolarReadings(solarData);
        setTemperatureReadings(temperatureData);
      } catch (error) {
        if (!mounted) return;

        setApiError(
          error instanceof Error
            ? error.message
            : "Unable to load energy readings"
        );
      }
    }

    loadReadings();

    return () => {
      mounted = false;
    };
  }, [
    backendStation,
    powerSensor?.id,
    fuelSensor?.id,
    solarSensor?.id,
    temperatureSensor?.id,
  ]);

  /* =========================================================
     LATEST VALUES
  ========================================================= */

  const latestPower = useMemo(() => {
    if (!powerReadings.length) return null;

    return [...powerReadings].sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() -
        new Date(a.recordedAt).getTime()
    )[0];
  }, [powerReadings]);

  const latestFuel = useMemo(() => {
    if (!fuelReadings.length) return null;

    return [...fuelReadings].sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() -
        new Date(a.recordedAt).getTime()
    )[0];
  }, [fuelReadings]);

  const latestSolar = useMemo(() => {
    if (!solarReadings.length) return null;

    return [...solarReadings].sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() -
        new Date(a.recordedAt).getTime()
    )[0];
  }, [solarReadings]);

  const latestTemperature = useMemo(() => {
    if (!temperatureReadings.length) return null;

    return [...temperatureReadings].sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() -
        new Date(a.recordedAt).getTime()
    )[0];
  }, [temperatureReadings]);

  /* =========================================================
     DISPLAY VALUES
  ========================================================= */

  const fallbackStation = stations[stationId];

  const generation =
    latestPower?.value ??
    fallbackStation?.energy?.generation ??
    0;

  const fuelReserve =
    latestFuel?.value ??
    fallbackStation?.energy?.fuelReserve ??
    0;

  const solarRadiation =
    latestSolar?.value ?? 0;

  const temperature =
    latestTemperature?.value ?? null;

  /*
   * The backend currently has a POWER GENERATION sensor,
   * but there is no separate POWER DEMAND sensor.
   *
   * Therefore we do not invent a demand value.
   */
  const demand: number | null = null;

  const reserve =
    demand !== null ? generation - demand : null;

  const loadPercentage =
    demand !== null && generation > 0
      ? Math.round((demand / generation) * 100)
      : null;

  const fuelStatus =
    fuelReserve >= 70
      ? "HEALTHY"
      : fuelReserve >= 40
      ? "MONITOR"
      : "CRITICAL";

  /* =========================================================
     CHART DATA
  ========================================================= */

  const chartData = useMemo(() => {
    if (powerReadings.length > 0) {
      return [...powerReadings]
        .sort(
          (a, b) =>
            new Date(a.recordedAt).getTime() -
            new Date(b.recordedAt).getTime()
        )
        .map((reading) => ({
          time: new Date(
            reading.recordedAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          generation: reading.value,
        }));
    }

    return telemetry[stationId] ?? [];
  }, [powerReadings, stationId]);

  const stationName =
    backendStation?.name ??
    fallbackStation?.name ??
    "Maitri Research Station";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="energy-page">

      {/* ================= HEADER ================= */}

      <section className="energy-heading">
        <div>
          <span className="energy-eyebrow">
            POLARIS / ENERGY SYSTEM
          </span>

          <h1>Energy Intelligence</h1>

          <p>
            Digital monitoring of generation, consumption,
            fuel endurance and renewable contribution at
            India's Antarctic research stations.
          </p>
        </div>

        <div className="energy-station-control">
          <span>ACTIVE STATION</span>

          <div>
            <button
              className={
                stationId === "maitri"
                  ? "energy-station-active"
                  : ""
              }
              onClick={() => setStationId("maitri")}
            >
              MAITRI
            </button>

            <button
              className={
                stationId === "bharati"
                  ? "energy-station-active"
                  : ""
              }
              onClick={() => setStationId("bharati")}
            >
              BHARATI
            </button>
          </div>
        </div>
      </section>

      {/* ================= DATA POLICY ================= */}

      <div className="energy-policy">
        <ShieldCheck size={18} />

        <strong>
          {apiError
            ? "BACKEND CONNECTION ISSUE"
            : loading
            ? "CONNECTING TO BACKEND"
            : "LIVE BACKEND DATA"}
        </strong>

        <span>
          {apiError
            ? apiError
            : "Energy telemetry is being read from the POLARIS backend sensor system."}
        </span>
      </div>

      {/* ================= HERO ================= */}

      <section
        className="energy-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(1, 27, 38, 0.97) 0%,
              rgba(1, 31, 42, 0.88) 35%,
              rgba(1, 31, 42, 0.52) 68%,
              rgba(1, 31, 42, 0.25) 100%
            ),
            url("/images/infrastructure/power.jpg")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="energy-hero-content">
          <span className="energy-eyebrow light">
            ANTARCTIC POWER NETWORK
          </span>

          <h2>{stationName} Energy System</h2>

          <p>
            Autonomous monitoring of generation capacity,
            electrical demand and station energy resilience.
          </p>

          <div className="energy-live">
            <span />
            ENERGY SYSTEM ONLINE
          </div>
        </div>

        <div className="energy-hero-stats">
          <div>
            <span>GENERATION</span>
            <strong>{generation}</strong>
            <small>kW</small>
          </div>

          <div>
            <span>DEMAND</span>
            <strong>
              {demand !== null ? demand : "—"}
            </strong>
            <small>kW</small>
          </div>

          <div>
            <span>RESERVE</span>
            <strong>
              {reserve !== null ? `+${reserve}` : "—"}
            </strong>
            <small>kW</small>
          </div>
        </div>
      </section>

      {/* ================= TOP METRICS ================= */}

      <section className="energy-metrics">

        <div className="energy-metric">
          <div className="energy-metric-icon">
            <Zap />
          </div>

          <span>POWER GENERATION</span>

          <strong>
            {generation}
            <small> kW</small>
          </strong>

          <p>
            Latest backend power sensor reading
          </p>
        </div>

        <div className="energy-metric">
          <div className="energy-metric-icon">
            <Activity />
          </div>

          <span>ENERGY STATUS</span>

          <strong>
            ACTIVE
          </strong>

          <p>
            Generation sensor online
          </p>
        </div>

        <div className="energy-metric">
          <div className="energy-metric-icon">
            <Fuel />
          </div>

          <span>FUEL RESERVE</span>

          <strong>
            {fuelReserve}
            <small>%</small>
          </strong>

          <p>
            Current fuel-level sensor reading
          </p>
        </div>

        <div className="energy-metric">
          <div className="energy-metric-icon">
            <Sun />
          </div>

          <span>SOLAR RADIATION</span>

          <strong>
            {solarRadiation}
            <small> W/m²</small>
          </strong>

          <p>
            Latest solar radiation sensor reading
          </p>
        </div>

      </section>

      {/* ================= MAIN GRID ================= */}

      <section className="energy-grid">

        {/* POWER FLOW */}

        <div className="energy-panel energy-flow-panel">

          <div className="energy-panel-heading">
            <div>
              <span>REAL-TIME DIGITAL TWIN</span>
              <h3>Station Power Flow</h3>
            </div>

            <Zap />
          </div>

          <div className="power-flow">

            <div className="power-node generator-node">
              <Activity />

              <span>GENERATOR</span>

              <strong>
                {generation} kW
              </strong>
            </div>

            <div className="power-line">
              <span className="power-particle p1" />
              <span className="power-particle p2" />
              <span className="power-particle p3" />
            </div>

            <div className="power-node station-node">
              <Zap />

              <span>STATION LOAD</span>

              <strong>
                {demand !== null
                  ? `${demand} kW`
                  : "NOT CONNECTED"}
              </strong>
            </div>

            <div className="power-line">
              <span className="power-particle p1" />
              <span className="power-particle p2" />
              <span className="power-particle p3" />
            </div>

            <div className="power-node reserve-node">
              <BatteryCharging />

              <span>RESERVE</span>

              <strong>
                {reserve !== null
                  ? `+${reserve} kW`
                  : "—"}
              </strong>
            </div>

          </div>

          <div className="power-flow-status">
            <span>
              <i />
              GENERATION ACTIVE
            </span>

            <span>
              {loadPercentage !== null
                ? `System load ${loadPercentage}%`
                : "Demand telemetry unavailable"}
            </span>
          </div>
        </div>

        {/* GENERATOR IMAGE */}

        <div className="energy-panel energy-image-card">

          <img
            src="/images/infrastructure/generator.jpg"
            alt="Antarctic station generator system"
          />

          <div className="energy-image-overlay">

            <span>PRIMARY GENERATION</span>

            <h3>Generator System</h3>

            <div className="image-card-value">
              <Gauge />

              <div>
                <strong>
                  {generation} kW
                </strong>

                <span>
                  Current Generation
                </span>
              </div>
            </div>

            <div className="energy-online">
              <i />
              OPERATIONAL
            </div>

          </div>
        </div>

        {/* 24 HOUR CHART */}

        <div className="energy-panel energy-chart-panel">

          <div className="energy-panel-heading">
            <div>
              <span>POWER ANALYTICS</span>
              <h3>Energy Generation Profile</h3>
            </div>

            <Activity />
          </div>

          <div className="energy-chart-legend">

            <span>
              <i className="energy-generation-dot" />
              Generation
            </span>

          </div>

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <AreaChart data={chartData}>

              <defs>

                <linearGradient
                  id="energyGeneration"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#16b981"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor="#16b981"
                    stopOpacity={0}
                  />
                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#dce8eb"
              />

              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
                stroke="#78919a"
              />

              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#78919a"
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="generation"
                stroke="#16b981"
                strokeWidth={2}
                fill="url(#energyGeneration)"
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>

        {/* FUEL STORAGE */}

        <div className="energy-panel energy-image-card">

          <img
            src="/images/energy/fuel-tank.jpg"
            alt="Antarctic fuel storage system"
          />

          <div className="energy-image-overlay">

            <span>ENERGY ENDURANCE</span>

            <h3>Fuel Storage</h3>

            <div className="fuel-number">
              {fuelReserve}%
            </div>

            <div className="fuel-bar">
              <div
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, fuelReserve)
                  )}%`,
                }}
              />
            </div>

            <p>
              Current monitored reserve{" "}
              <strong>
                {fuelReserve}%
              </strong>
            </p>

            <div className="energy-online">
              <i />
              {fuelStatus}
            </div>

          </div>
        </div>

        {/* RENEWABLE / SOLAR */}

        <div className="energy-panel energy-image-card solar-card">

          <img
            src="/images/energy/solar-snow.jpg"
            alt="Polar renewable energy system"
          />

          <div className="energy-image-overlay">

            <span>RENEWABLE MONITORING</span>

            <h3>Solar Radiation</h3>

            <div className="renewable-value">

              <Leaf />

              <strong>
                {solarRadiation}
                <small> W/m²</small>
              </strong>

            </div>

            <p>
              Latest solar radiation measurement from
              the Maitri sensor network.
            </p>

          </div>
        </div>

        {/* AI ENERGY INTELLIGENCE */}

        <div className="energy-panel energy-ai">

          <div className="energy-panel-heading">
            <div>
              <span>POLARIS AI</span>
              <h3>Energy Intelligence</h3>
            </div>

            <Zap />
          </div>

          <div className="energy-ai-status">

            <div className="energy-ai-orb">
              <Zap />
            </div>

            <div>
              <strong>
                PREDICTION ENGINE ACTIVE
              </strong>

              <span>
                Evaluating live station telemetry
              </span>
            </div>

          </div>

          <div className="energy-insight">

            <span>
              <Thermometer size={17} />
              CURRENT TEMPERATURE
            </span>

            <strong>
              {temperature !== null
                ? `${temperature} °C`
                : "Temperature unavailable"}
            </strong>

            <p>
              Temperature telemetry is being read from
              the station temperature sensor.
            </p>

            <div className="energy-confidence">
              <span>
                SENSOR STATUS
              </span>

              <strong>
                {temperatureSensor
                  ? temperatureSensor.status
                  : "N/A"}
              </strong>
            </div>

          </div>

          <div className="energy-insight success">

            <span>
              <BatteryCharging size={17} />
              GENERATION STATUS
            </span>

            <strong>
              {generation} kW generation reading
              available.
            </strong>

            <p>
              POLARIS is receiving power telemetry from
              the connected generation sensor.
            </p>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="energy-footer">

        <span>
          POLARIS • Antarctic Digital Twin
        </span>

        <span>
          ENERGY INTELLIGENCE • SIH26060
        </span>

      </footer>

    </div>
  );
}