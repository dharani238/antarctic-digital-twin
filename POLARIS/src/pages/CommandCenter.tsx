import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  Clock3,
  CloudSnow,
  Cpu,
  Fuel,
  MapPin,
  Radio,
  RefreshCw,
  Server,
  Thermometer,
  Truck,
  Zap,
  Droplets,
  Wind,
} from "lucide-react";

import { useStation } from "../context/StationContext";

import {
  getDashboard,
  type DashboardData,
  type StationTelemetry as ApiStationTelemetry,
} from "../services/api";

import "./CommandCenter.css";

/* =========================================================
   TYPES
========================================================= */

type ConnectionMode = "loading" | "online" | "demo";

type StationKey = "bharati" | "maitri";

type Severity = "normal" | "watch" | "warning";

interface DashboardMetrics {
  stations: number;
  infrastructures: number;
  sensors: number;
  activeSensors: number;
  activeAlerts: number;
}

interface StationPresentation {
  name: string;
  code: string;
  location: string;
  coordinates: string;

  condition: string;
  temperature: string;
  wind: string;
  pressure: string;
  visibility: string;

  demand: string;
  fuel: string;
  water: string;
  availability: string;

  demandValue: number;

  hero: string;
  aerial: string;
}

interface EventItem {
  time: string;
  subsystem: string;
  message: string;
  severity: "info" | "watch" | "warning";
}

/* =========================================================
   FALLBACK / PRESENTATION DATA

   Used only when the backend is unavailable or for fields
   that are currently not stored in PostgreSQL, such as
   visibility and station imagery.
========================================================= */

const fallbackMetrics: DashboardMetrics = {
  stations: 2,
  infrastructures: 12,
  sensors: 14,
  activeSensors: 14,
  activeAlerts: 1,
};

const stationData: Record<StationKey, StationPresentation> = {
  bharati: {
    name: "Bharati",
    code: "BHR-01",

    location: "Larsemann Hills, East Antarctica",
    coordinates: "69°24′S · 76°11′E",

    condition: "Drifting snow",

    temperature: "-21.4°C",
    wind: "46 km/h",
    pressure: "968 hPa",
    visibility: "5.7 km",

    demand: "356 kW",
    fuel: "83%",
    water: "91%",
    availability: "100%",

    demandValue: 356,

    hero: "/images/stations/bharati-hero.jpg",
    aerial: "/images/stations/bharati-aerial.jpg",
  },

  maitri: {
    name: "Maitri",
    code: "MTR-01",

    location: "Schirmacher Oasis, East Antarctica",
    coordinates: "70°46′S · 11°44′E",

    condition: "Blowing snow",

    temperature: "-18.7°C",
    wind: "32 km/h",
    pressure: "974 hPa",
    visibility: "7.1 km",

    demand: "294 kW",
    fuel: "76%",
    water: "88%",
    availability: "83.3%",

    demandValue: 294,

    hero: "/images/stations/maitri-hero.jpg",
    aerial: "/images/stations/maitri-winter.jpg",
  },
};

/* =========================================================
   DEMO EVENTS

   Backend alerts automatically replace these when alerts
   exist for the selected station.
========================================================= */

const fallbackEvents: Record<StationKey, EventItem[]> = {
  bharati: [
    {
      time: "09:18",
      subsystem: "Environment",
      message:
        "Visibility trending below preferred logistics window.",
      severity: "watch",
    },
    {
      time: "08:46",
      subsystem: "Power",
      message:
        "Generator output stabilized after transient load increase.",
      severity: "info",
    },
    {
      time: "08:12",
      subsystem: "Communications",
      message: "Satellite communications link verified.",
      severity: "info",
    },
    {
      time: "07:35",
      subsystem: "Fuel",
      message:
        "Reserve endurance remains inside monitoring range.",
      severity: "watch",
    },
  ],

  maitri: [
    {
      time: "09:06",
      subsystem: "Environment",
      message:
        "Elevated wind conditions around station perimeter.",
      severity: "watch",
    },
    {
      time: "08:32",
      subsystem: "HVAC",
      message:
        "Heating loop operating within nominal range.",
      severity: "info",
    },
    {
      time: "07:58",
      subsystem: "Communications",
      message:
        "Primary satellite link responding normally.",
      severity: "info",
    },
    {
      time: "07:22",
      subsystem: "Power",
      message:
        "Station electrical demand remains stable.",
      severity: "info",
    },
  ],
};

/* =========================================================
   HELPERS
========================================================= */

function formatTelemetry(
  reading:
    | {
        value: number;
        unit: string;
        recordedAt: string;
      }
    | null
    | undefined,
  fallback: string,
  spaceBeforeUnit = true
) {
  if (!reading) {
    return fallback;
  }

  return spaceBeforeUnit
    ? `${reading.value} ${reading.unit}`
    : `${reading.value}${reading.unit}`;
}

function formatCoordinates(
  station: ApiStationTelemetry | undefined,
  fallback: string
) {
  if (!station) {
    return fallback;
  }

  const { latitude, longitude } = station.location;

  return `${Math.abs(latitude).toFixed(4)}°${
    latitude < 0 ? "S" : "N"
  } · ${Math.abs(longitude).toFixed(4)}°${
    longitude < 0 ? "W" : "E"
  }`;
}

function alertSeverityToEvent(
  severity: string
): EventItem["severity"] {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return "warning";

    case "WARNING":
      return "watch";

    default:
      return "info";
  }
}

function formatAlertTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================================================
   COMMAND CENTER
========================================================= */

export default function CommandCenter() {
  const navigate = useNavigate();

  const { stationId, setStationId } = useStation();

  const selectedStation: StationKey =
    stationId === "maitri" ? "maitri" : "bharati";

  /*
   * Presentation-only information:
   * images, visibility and textual weather description.
   */
  const presentation = stationData[selectedStation];

  const [connection, setConnection] =
    useState<ConnectionMode>("loading");

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [metrics, setMetrics] =
    useState<DashboardMetrics>(fallbackMetrics);

  const [updatedAt, setUpdatedAt] =
    useState(new Date());

  /* =======================================================
     BACKEND
  ======================================================= */

  const loadDashboard = useCallback(async () => {
    setConnection("loading");

    try {
      const response = await getDashboard();

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to retrieve dashboard data."
        );
      }

      const data = response.data;

      setDashboard(data);

      setMetrics({
        stations: data.stations ?? 0,

        infrastructures:
          data.infrastructures ?? 0,

        sensors:
          data.sensors ?? 0,

        activeSensors:
          data.activeSensors ?? 0,

        activeAlerts:
          data.activeAlerts ?? 0,
      });

      setConnection("online");
    } catch (error) {
      console.warn(
        "Dashboard API unavailable. Using demonstration data.",
        error
      );

      setDashboard(null);

      setMetrics(fallbackMetrics);

      setConnection("demo");
    } finally {
      setUpdatedAt(new Date());
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  /* =======================================================
     SELECTED DATABASE STATION
  ======================================================= */

  const backendStation = useMemo(() => {
    if (!dashboard?.stationTelemetry) {
      return undefined;
    }

    return dashboard.stationTelemetry.find(
      (item) =>
        item.name.toLowerCase() ===
        selectedStation.toLowerCase()
    );
  }, [dashboard, selectedStation]);

  /* =======================================================
     DATABASE-BACKED DISPLAY VALUES
  ======================================================= */

  const stationName =
    backendStation?.name ??
    presentation.name;

  const stationCode =
    backendStation?.code ??
    presentation.code;

  const coordinates = formatCoordinates(
    backendStation,
    presentation.coordinates
  );

  const temperature = formatTelemetry(
    backendStation?.telemetry.temperature,
    presentation.temperature,
    false
  );

  const wind = formatTelemetry(
    backendStation?.telemetry.windSpeed,
    presentation.wind
  );

  const pressure = formatTelemetry(
    backendStation?.telemetry.pressure,
    presentation.pressure
  );

  const demand = formatTelemetry(
    backendStation?.telemetry.power,
    presentation.demand
  );

  const fuel = formatTelemetry(
    backendStation?.telemetry.fuelLevel,
    presentation.fuel,
    false
  );

  const water = formatTelemetry(
    backendStation?.telemetry.waterLevel,
    presentation.water,
    false
  );

  const demandValue =
    backendStation?.telemetry.power?.value ??
    presentation.demandValue;

  const infrastructureAvailability =
    backendStation
      ? `${backendStation.statistics.infrastructureAvailability}%`
      : presentation.availability;

  const selectedSensorAvailability =
    backendStation
      ? backendStation.statistics.sensorAvailability
      : metrics.sensors > 0
      ? Number(
          (
            (metrics.activeSensors /
              metrics.sensors) *
            100
          ).toFixed(1)
        )
      : 0;

  const selectedSensorCount =
    backendStation?.statistics.sensors ??
    metrics.sensors;

  const selectedActiveSensorCount =
    backendStation?.statistics.activeSensors ??
    metrics.activeSensors;

  const selectedInfrastructureCount =
    backendStation?.statistics.infrastructures ??
    metrics.infrastructures;

  const selectedActiveAlerts =
    backendStation?.statistics.activeAlerts ??
    metrics.activeAlerts;

  /* =======================================================
     POWER HISTORY

     Prefer actual POWER SensorReading records.
     Fall back to generated display values only when the
     backend has no historical power readings.
  ======================================================= */

  const chartValues = useMemo(() => {
    const powerReadings =
      dashboard?.recentReadings
        ?.filter((reading) => {
          const sensor = reading.sensor;

          return (
            sensor?.type === "POWER" &&
            sensor?.station?.name
              ?.toLowerCase() ===
              selectedStation.toLowerCase()
          );
        })
        .sort(
          (a, b) =>
            new Date(a.recordedAt).getTime() -
            new Date(b.recordedAt).getTime()
        )
        .map((reading) => reading.value)
        .slice(-9) ?? [];

    if (powerReadings.length >= 2) {
      return powerReadings;
    }

    const d = demandValue;

    return [
      d - 48,
      d - 36,
      d - 21,
      d - 11,
      d + 4,
      d + 17,
      d + 25,
      d + 14,
      d,
    ];
  }, [
    dashboard,
    demandValue,
    selectedStation,
  ]);

  /* =======================================================
     EVENTS / ALERTS
  ======================================================= */

  const currentEvents = useMemo<EventItem[]>(() => {
    if (
      backendStation?.alerts &&
      backendStation.alerts.length > 0
    ) {
      return backendStation.alerts
        .slice(0, 4)
        .map((alert) => ({
          time: formatAlertTime(
            alert.triggeredAt
          ),

          subsystem:
            alert.sensor?.name ??
            alert.sensor?.type ??
            "Station",

          message:
            alert.message ||
            alert.title,

          severity:
            alertSeverityToEvent(
              alert.severity
            ),
        }));
    }

    return fallbackEvents[selectedStation];
  }, [backendStation, selectedStation]);

  const time =
    updatedAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="command-page">

      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className="command-hero"
        style={
          {
            "--hero-image": `url("${presentation.hero}")`,
          } as CSSProperties
        }
      >
        <div className="hero-image" />
        <div className="hero-gradient" />

        <div className="hero-toolbar">
          <div className="hero-title-small">
            <span className="hero-live-dot" />

            <div>
              <strong>Command Center</strong>

              <small>
                Antarctic station operations
              </small>
            </div>
          </div>

          <div className="hero-toolbar-right">
            <div className="updated-time">
              <span>Updated</span>
              <strong>{time}</strong>
            </div>

            <button
              className="icon-button"
              onClick={() =>
                void loadDashboard()
              }
              aria-label="Refresh dashboard"
            >
              <RefreshCw
                size={17}
                className={
                  connection === "loading"
                    ? "rotate-icon"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        <div className="hero-main">
          <div className="hero-copy">
            <div className="station-label">
              {stationName} Research Station
            </div>

            <h1>Antarctic Operations</h1>

            <p>
              Real-time operational awareness
              across infrastructure, power,
              environmental conditions,
              communications and station
              logistics.
            </p>

            <div className="station-selector">
              <button
                className={
                  selectedStation === "bharati"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setStationId("bharati")
                }
              >
                Bharati
              </button>

              <button
                className={
                  selectedStation === "maitri"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setStationId("maitri")
                }
              >
                Maitri
              </button>
            </div>
          </div>

          <div className="hero-station-card">
            <div className="hero-station-top">
              <div>
                <span>Selected station</span>
                <strong>{stationName}</strong>
              </div>

              <div
                className={`connection-state ${connection}`}
              >
                <i />

                {connection === "online"
                  ? "Connected"
                  : connection ===
                    "loading"
                  ? "Connecting"
                  : "Demo data"}
              </div>
            </div>

            <div className="hero-location">
              <MapPin size={15} />

              <div>
                <strong>
                  {presentation.location}
                </strong>

                <span>
                  {coordinates}
                </span>
              </div>
            </div>

            <div className="hero-weather">
              <div>
                <span>Temperature</span>
                <strong>
                  {temperature}
                </strong>
              </div>

              <div>
                <span>Wind</span>
                <strong>{wind}</strong>
              </div>

              <div>
                <span>Demand</span>
                <strong>{demand}</strong>
              </div>
            </div>

            <button
              className="hero-open-button"
              onClick={() =>
                navigate("/twin")
              }
            >
              Open digital twin
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="hero-metrics">
          <HeroMetric
            label="Temperature"
            value={temperature}
            icon={
              <Thermometer size={18} />
            }
          />

          <HeroMetric
            label="Wind"
            value={wind}
            icon={<Wind size={18} />}
          />

          <HeroMetric
            label="Power demand"
            value={demand}
            icon={<Zap size={18} />}
          />

          <HeroMetric
            label="Telemetry"
            value={`${selectedSensorAvailability}%`}
            icon={<Activity size={18} />}
          />

          <HeroMetric
            label="Fuel level"
            value={fuel}
            icon={<Fuel size={18} />}
          />
        </div>
      </section>

      {/* ===================================================
          PAGE CONTENT
      =================================================== */}

      <div className="command-content">

        {connection === "demo" && (
          <div className="demo-notice">
            <AlertTriangle size={15} />

            <span>
              Demonstration telemetry is
              active while the operational
              API is unavailable.
            </span>

            <button
              onClick={() =>
                void loadDashboard()
              }
            >
              Retry
            </button>
          </div>
        )}

        {/* =================================================
            STATUS
        ================================================= */}

        <SectionHeading
          title="Station status"
          subtitle={`Current operational state of ${stationName}`}
        />

        <section className="status-grid">
          <StatusCard
            icon={<Server size={20} />}
            title="Infrastructure"
            value={
              infrastructureAvailability
            }
            description={`${selectedInfrastructureCount} assets monitored`}
            status={
              backendStation &&
              backendStation.statistics
                .infrastructureAvailability <
                100
                ? "watch"
                : "normal"
            }
          />

          <StatusCard
            icon={<Zap size={20} />}
            title="Power"
            value={demand}
            description="Station electrical demand"
            status="normal"
          />

          <StatusCard
            icon={
              <CloudSnow size={20} />
            }
            title="Environment"
            value={
              presentation.visibility
            }
            description={
              presentation.condition
            }
            status="watch"
          />

          <StatusCard
            icon={<Fuel size={20} />}
            title="Fuel"
            value={fuel}
            description="Current reserve level"
            status="normal"
          />
        </section>

        {/* =================================================
            STATION VIEW
        ================================================= */}

        <SectionHeading
          title={`${stationName} digital twin`}
          subtitle="Spatial overview and monitored station systems"
          action="Open full digital twin"
          onAction={() =>
            navigate("/twin")
          }
        />

        <section className="station-workspace">
          <div className="station-image-panel">
            <img
              src={presentation.aerial}
              alt={`${stationName} station`}
            />

            <div className="station-image-shade" />

            <div className="station-photo-header">
              <div className="photo-status">
                <i />
                Operational
              </div>

              <span>
                {stationCode}
              </span>
            </div>

            <StationPin
              className="pin-one"
              label="Environment"
              value={temperature}
            />

            <StationPin
              className="pin-two"
              label="Power"
              value={demand}
            />

            <StationPin
              className="pin-three"
              label="Comms"
              value="Online"
            />

            <div className="station-photo-bottom">
              <div>
                <span>
                  Station overview
                </span>

                <h2>{stationName}</h2>

                <p>
                  <MapPin size={14} />
                  {coordinates}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/twin")
                }
              >
                Explore station
                <ArrowRight
                  size={15}
                />
              </button>
            </div>
          </div>

          <div className="systems-panel">
            <div className="panel-header">
              <div>
                <span>Systems</span>
                <h3>
                  Operational health
                </h3>
              </div>

              <Activity size={20} />
            </div>

            <SystemRow
              icon={<Server size={18} />}
              title="Infrastructure"
              subtitle={`${selectedInfrastructureCount} monitored assets`}
              value={
                infrastructureAvailability
              }
              status={
                backendStation &&
                backendStation.statistics
                  .infrastructureAvailability <
                  100
                  ? "watch"
                  : "normal"
              }
            />

            <SystemRow
              icon={<Zap size={18} />}
              title="Power generation"
              subtitle="Primary and standby systems"
              value={demand}
            />

            <SystemRow
              icon={<Radio size={18} />}
              title="Communications"
              subtitle="Satellite link"
              value="Online"
            />

            <SystemRow
              icon={
                <Droplets size={18} />
              }
              title="Water systems"
              subtitle="Treatment and storage"
              value={water}
            />

            <SystemRow
              icon={
                <CloudSnow
                  size={18}
                />
              }
              title="Environment"
              subtitle={
                presentation.condition
              }
              value={temperature}
              status="watch"
            />

            <div className="sensor-summary">
              <div className="sensor-number">
                {selectedSensorAvailability}%
              </div>

              <div>
                <strong>
                  Telemetry availability
                </strong>

                <span>
                  {selectedActiveSensorCount}{" "}
                  of{" "}
                  {selectedSensorCount}{" "}
                  sensors reporting
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            MAP
        ================================================= */}

        <SectionHeading
          title="Antarctic station network"
          subtitle="Geospatial overview of active research stations"
        />

        <section className="network-layout">
          <div className="network-map">
            <img
              src="/images/antarctica/antarctica-map.jpg"
              alt="Antarctica map"
            />

            <div className="network-map-shade" />

            <div className="map-heading">
              <span>Station network</span>
              <strong>Antarctica</strong>
            </div>

            <button
              className={`map-marker maitri ${
                selectedStation ===
                "maitri"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setStationId("maitri")
              }
            >
              <i />

              <div>
                <strong>Maitri</strong>
                <span>
                  70°46′S · 11°44′E
                </span>
              </div>
            </button>

            <button
              className={`map-marker bharati ${
                selectedStation ===
                "bharati"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setStationId("bharati")
              }
            >
              <i />

              <div>
                <strong>Bharati</strong>
                <span>
                  69°24′S · 76°11′E
                </span>
              </div>
            </button>

            <div className="map-bottom">
              <div>
                <span>Stations</span>
                <strong>
                  {metrics.stations}
                </strong>
              </div>

              <div>
                <span>Sensors</span>
                <strong>
                  {metrics.sensors}
                </strong>
              </div>

              <div>
                <span>Reporting</span>
                <strong>
                  {metrics.activeSensors}
                </strong>
              </div>

              <div>
                <span>Alerts</span>
                <strong>
                  {metrics.activeAlerts}
                </strong>
              </div>
            </div>
          </div>

          <div className="station-profile">
            <img
              src={presentation.hero}
              alt={stationName}
            />

            <div className="profile-copy">
              <span>
                Selected station
              </span>

              <h3>{stationName}</h3>

              <p>
                {presentation.location}
              </p>
            </div>

            <InfoRow
              label="Coordinates"
              value={coordinates}
            />

            <InfoRow
              label="Conditions"
              value={
                presentation.condition
              }
            />

            <InfoRow
              label="Temperature"
              value={temperature}
            />

            <InfoRow
              label="Pressure"
              value={pressure}
            />

            <InfoRow
              label="Visibility"
              value={
                presentation.visibility
              }
            />

            <InfoRow
              label="Fuel level"
              value={fuel}
            />

            <InfoRow
              label="Water level"
              value={water}
            />

            <button
              onClick={() =>
                navigate("/twin")
              }
            >
              View station
              <ArrowRight size={15} />
            </button>
          </div>
        </section>

        {/* =================================================
            OPERATIONS
        ================================================= */}

        <SectionHeading
          title="Operations"
          subtitle="Key station systems and operational areas"
        />

        <section className="operation-grid">
          <OperationCard
            image="/images/infrastructure/laboratory.jpg"
            icon={<Boxes size={18} />}
            title="Infrastructure"
            description="Buildings, laboratories and critical station assets."
            onClick={() =>
              navigate(
                "/infrastructure"
              )
            }
          />

          <OperationCard
            image="/images/infrastructure/power.jpg"
            icon={<Zap size={18} />}
            title="Energy"
            description="Generation, electrical demand and fuel systems."
            onClick={() =>
              navigate("/energy")
            }
          />

          <OperationCard
            image="/images/environment/ice-aerial.jpg"
            icon={
              <CloudSnow size={18} />
            }
            title="Environment"
            description="Weather, visibility and external conditions."
            onClick={() =>
              navigate(
                "/environment"
              )
            }
          />

          <OperationCard
            image="/images/logistics/supply-ship.jpg"
            icon={<Truck size={18} />}
            title="Logistics"
            description="Supplies, transport and station endurance."
            onClick={() =>
              navigate("/logistics")
            }
          />
        </section>

        {/* =================================================
            POWER + EVENTS
        ================================================= */}

        <section className="analytics-layout">
          <div className="analytics-card">
            <div className="panel-header">
              <div>
                <span>Power</span>
                <h3>
                  Electrical demand
                </h3>
              </div>

              <BarChart3 size={20} />
            </div>

            <div className="demand-summary">
              <div>
                <span>
                  Current demand
                </span>

                <strong>
                  {demand}
                </strong>
              </div>

              <div className="normal-chip">
                Stable
              </div>
            </div>

            <DemandChart
              values={chartValues}
            />

            <div className="chart-labels">
              <span>8h ago</span>
              <span>6h</span>
              <span>4h</span>
              <span>2h</span>
              <span>Now</span>
            </div>
          </div>

          <div className="events-card">
            <div className="panel-header">
              <div>
                <span>Activity</span>
                <h3>Recent events</h3>
              </div>

              <Clock3 size={20} />
            </div>

            <div className="event-list">
              {currentEvents.map(
                (event, index) => (
                  <EventRow
                    key={`${event.time}-${index}`}
                    event={event}
                  />
                )
              )}
            </div>

            <button
              className="view-alerts-button"
              onClick={() =>
                navigate("/alerts")
              }
            >
              View all alerts
              <ArrowRight size={15} />
            </button>
          </div>
        </section>

        {/* =================================================
            INTELLIGENCE
        ================================================= */}

        <SectionHeading
          title="Operational intelligence"
          subtitle="Forecasting and decision-support tools"
        />

        <section className="intelligence-panel">
          <div className="intelligence-copy">
            <div className="intelligence-icon">
              <Cpu size={23} />
            </div>

            <div>
              <span>
                72-hour outlook
              </span>

              <h2>
                Systems remain within
                the current operating
                envelope.
              </h2>

              <p>
                Environmental conditions
                should continue to be
                monitored. Power demand
                and station reserves
                remain within the current
                prototype planning range.
              </p>

              <div className="intelligence-actions">
                <button
                  onClick={() =>
                    navigate(
                      "/predictions"
                    )
                  }
                >
                  View predictions
                  <ArrowRight
                    size={15}
                  />
                </button>

                <button
                  className="secondary"
                  onClick={() =>
                    navigate(
                      "/scenario-lab"
                    )
                  }
                >
                  Scenario lab
                </button>
              </div>
            </div>
          </div>

          <div className="intelligence-stats">
            <IntelligenceStat
              label="Active alerts"
              value={String(
                selectedActiveAlerts
              )}
              detail="Current station"
            />

            <IntelligenceStat
              label="Fuel reserve"
              value={fuel}
              detail="Current level"
            />

            <IntelligenceStat
              label="System availability"
              value={
                infrastructureAvailability
              }
              detail="Infrastructure"
            />
          </div>
        </section>

        <footer className="command-footer">
          <div>
            <strong>POLARIS</strong>
            <span>
              Antarctic Operations
              Platform
            </span>
          </div>

          <span>
            {connection === "online"
              ? "Operational API connected · synthetic prototype telemetry"
              : "Demonstration data active"}
          </span>
        </footer>
      </div>
    </main>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function SectionHeading({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {action && onAction && (
        <button onClick={onAction}>
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function HeroMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="hero-metric">
      <div className="hero-metric-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  value,
  description,
  status,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
  status: Severity;
}) {
  return (
    <article className="status-card">
      <div className="status-card-top">
        <div className="status-icon">
          {icon}
        </div>

        <div
          className={`status-indicator ${status}`}
        >
          <i />

          {status === "normal"
            ? "Operational"
            : status === "watch"
            ? "Monitor"
            : "Attention"}
        </div>
      </div>

      <span>{title}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  );
}

function SystemRow({
  icon,
  title,
  subtitle,
  value,
  status = "normal",
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  value: string;
  status?: Severity;
}) {
  return (
    <div className="system-row">
      <div className="system-icon">
        {icon}
      </div>

      <div className="system-copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      <div
        className={`system-value ${status}`}
      >
        {value}
      </div>
    </div>
  );
}

function StationPin({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div
      className={`station-pin ${className}`}
    >
      <i />

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function OperationCard({
  image,
  icon,
  title,
  description,
  onClick,
}: {
  image: string;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      className="operation-card"
      onClick={onClick}
    >
      <img
        src={image}
        alt={title}
      />

      <div className="operation-shade" />

      <div className="operation-icon">
        {icon}
      </div>

      <div className="operation-copy">
        <h3>{title}</h3>
        <p>{description}</p>

        <span>
          Open
          <ArrowRight size={14} />
        </span>
      </div>
    </button>
  );
}

function DemandChart({
  values,
}: {
  values: number[];
}) {
  if (values.length === 0) {
    return (
      <div className="demand-chart" />
    );
  }

  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <div className="demand-chart">
      {values.map(
        (value, index) => {
          const percentage =
            max === min
              ? 60
              : 35 +
                ((value - min) /
                  (max - min)) *
                  55;

          return (
            <div
              className="demand-column"
              key={`${value}-${index}`}
            >
              <span
                style={{
                  height: `${percentage}%`,
                }}
              />

              {index ===
                values.length - 1 && (
                <b>
                  {Number(
                    value.toFixed(1)
                  )}
                </b>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}

function EventRow({
  event,
}: {
  event: EventItem;
}) {
  return (
    <div className="event-row">
      <span className="event-time">
        {event.time}
      </span>

      <div className="event-copy">
        <span>
          {event.subsystem}
        </span>

        <strong>
          {event.message}
        </strong>
      </div>

      <div
        className={`event-status ${event.severity}`}
      >
        {event.severity === "info"
          ? "Normal"
          : event.severity ===
            "watch"
          ? "Monitor"
          : "Attention"}
      </div>
    </div>
  );
}

function IntelligenceStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="intelligence-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}