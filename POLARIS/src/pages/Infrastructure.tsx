import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Radio,
  Thermometer,
  Wrench,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useStation } from "../context/StationContext";
import { stations } from "../data/stations";

import {
  getStations,
  type Infrastructure as ApiInfrastructure,
  type Station,
} from "../services/api";

type SystemStatus = "nominal" | "warning";

type BackendStation = Station & {
  infrastructures?: ApiInfrastructure[];
};

/* =========================================================
   SYSTEM CARD
========================================================= */

interface SystemCardProps {
  title: string;
  subtitle: string;
  image: string;
  status: SystemStatus;
  value: string;
  detail: string;
  icon: React.ReactNode;
}

function SystemCard({
  title,
  subtitle,
  image,
  status,
  value,
  detail,
  icon,
}: SystemCardProps) {
  return (
    <article className="infra-system-card">
      <div className="infra-system-image">
        <img src={image} alt={title} />

        <div className="infra-image-shade" />

        <div className={`infra-status ${status}`}>
          <span />
          {status.toUpperCase()}
        </div>

        <div className="infra-card-icon">{icon}</div>

        <div className="infra-image-title">
          <span>{subtitle}</span>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="infra-card-data">
        <div>
          <span>BACKEND / DIGITAL TWIN</span>
          <strong>{value}</strong>
        </div>

        <p>{detail}</p>
      </div>
    </article>
  );
}

/* =========================================================
   STATUS NORMALIZATION
========================================================= */

function normalizeStatus(status?: string): SystemStatus {
  if (!status) return "nominal";

  const value = status.toUpperCase();

  if (
    value === "WARNING" ||
    value === "DEGRADED" ||
    value === "MAINTENANCE" ||
    value === "CRITICAL"
  ) {
    return "warning";
  }

  return "nominal";
}

/* =========================================================
   INFRASTRUCTURE PAGE
========================================================= */

export default function Infrastructure() {
  const { stationId, setStationId } = useStation();

  const station = stations[stationId];

  const [backendStations, setBackendStations] = useState<
    BackendStation[]
  >([]);

  const [backendLoading, setBackendLoading] =
    useState(true);

  const [backendError, setBackendError] =
    useState<string | null>(null);

  /* =======================================================
     LOAD STATIONS

     We use /stations because that endpoint already returns
     infrastructures nested inside each station.
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadStations() {
      try {
        setBackendLoading(true);
        setBackendError(null);

        const response = await getStations();

        if (!mounted) return;

        setBackendStations(
          (response.data ?? []) as BackendStation[]
        );
      } catch (error) {
        if (!mounted) return;

        setBackendError(
          error instanceof Error
            ? error.message
            : "Unable to connect to POLARIS backend"
        );
      } finally {
        if (mounted) {
          setBackendLoading(false);
        }
      }
    }

    void loadStations();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     SELECTED BACKEND STATION
  ======================================================= */

  const backendStation = useMemo(() => {
    return backendStations.find(
      (item) =>
        item.code?.toLowerCase() === stationId ||
        item.name?.toLowerCase().includes(stationId)
    );
  }, [backendStations, stationId]);

  /* =======================================================
     BACKEND INFRASTRUCTURE RECORDS
  ======================================================= */

  const backendInfrastructure =
    backendStation?.infrastructures ?? [];

  const primaryInfrastructure =
    backendInfrastructure[0];

  /* =======================================================
     WARNINGS
  ======================================================= */

  const backendWarningCount = backendInfrastructure.filter(
    (item) =>
      normalizeStatus(item.status) === "warning"
  ).length;

  /* =======================================================
     SYSTEM CARDS
  ======================================================= */

  const systems = useMemo<SystemCardProps[]>(() => {
    const result: SystemCardProps[] = [
      {
        title: "Power Generation",
        subtitle: "PRIMARY POWER SYSTEM",
        image: "/images/infrastructure/power.jpg",
        status: "nominal",
        value: `${station.energy.generation} kW`,
        detail: `${station.energy.generatorLoad}% generator load`,
        icon: <Zap size={21} />,
      },

      {
        title: "Satellite Communications",
        subtitle: "REMOTE CONNECTIVITY",
        image: "/images/infrastructure/communications.jpg",
        status: "nominal",
        value: `${station.communications.latency} ms`,
        detail: `${station.communications.downlink} Mbps downlink`,
        icon: <Radio size={21} />,
      },

      {
        title:
          primaryInfrastructure?.name ??
          "Station Infrastructure",
        subtitle:
          primaryInfrastructure?.type ??
          "BACKEND INFRASTRUCTURE",
        image: "/images/infrastructure/laboratory.jpg",
        status: normalizeStatus(
          primaryInfrastructure?.status
        ),
        value:
          primaryInfrastructure?.status ??
          "NO RECORD",
       detail:
  typeof primaryInfrastructure?.description === "string"
    ? primaryInfrastructure.description
    : "No infrastructure record available for this station.",
        icon: <Activity size={21} />,
      },
    ];

    return result;
  }, [
    primaryInfrastructure,
    station.communications.downlink,
    station.communications.latency,
    station.energy.generation,
    station.energy.generatorLoad,
  ]);

  /* =======================================================
     SUBSYSTEM ROWS

     The actual backend infrastructure record is shown first.
     The remaining operational values stay as prototype
     station-level information where the backend schema does
     not currently provide those fields.
  ======================================================= */

  const componentRows = useMemo(() => {
    return [
      {
        name:
          primaryInfrastructure?.name ??
          "Main Infrastructure",
        icon: <Activity size={18} />,
        status: normalizeStatus(
          primaryInfrastructure?.status
        ),
        value:
          primaryInfrastructure?.status ??
          "No backend record",
      },

      {
        name: "HVAC & Thermal Control",
        icon: <Thermometer size={18} />,
        status: "nominal" as SystemStatus,
        value: "Operational",
      },

      {
        name: "Electrical Distribution",
        icon: <Zap size={18} />,
        status: "nominal" as SystemStatus,
        value: `${station.energy.demand} kW demand`,
      },

      {
        name: "Water Systems",
        icon: <Droplets size={18} />,
        status: "nominal" as SystemStatus,
        value: "Operational",
      },

      {
        name: "Communications",
        icon: <Radio size={18} />,
        status: "nominal" as SystemStatus,
        value: `${station.communications.latency} ms latency`,
      },

      {
        name: "Generator System",
        icon: <Activity size={18} />,
        status: "nominal" as SystemStatus,
        value: `${station.energy.generatorLoad}% load`,
      },
    ];
  }, [
    primaryInfrastructure,
    station.communications.latency,
    station.energy.demand,
    station.energy.generatorLoad,
  ]);

  const warningCount =
    backendWarningCount +
    componentRows.filter(
      (system) =>
        system.status === "warning" &&
        system.name !==
          (primaryInfrastructure?.name ??
            "Main Infrastructure")
    ).length;

  /* =======================================================
     BACKEND RECORD COUNT
  ======================================================= */

  const backendRecordCount =
    backendInfrastructure.length;

  return (
    <div className="infra-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="infra-heading">
        <div>
          <span className="infra-eyebrow">
            POLARIS / INFRASTRUCTURE
          </span>

          <h1>Station Infrastructure</h1>

          <p>
            Operational overview of critical station systems
            using backend infrastructure records and prototype
            telemetry.
          </p>
        </div>

        <div className="infra-station-control">
          <span>ACTIVE STATION</span>

          <div>
            <button
              className={
                stationId === "maitri"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStationId("maitri")
              }
            >
              MAITRI
            </button>

            <button
              className={
                stationId === "bharati"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStationId("bharati")
              }
            >
              BHARATI
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================
          BACKEND STATUS
      =================================================== */}

      <div className="infra-policy">
        {backendError ? (
          <AlertTriangle size={17} />
        ) : (
          <CheckCircle2 size={17} />
        )}

        <strong>
          {backendLoading
            ? "CONNECTING TO BACKEND"
            : backendError
            ? "BACKEND CONNECTION"
            : "LIVE BACKEND DATA"}
        </strong>

        <span>
          {backendLoading
            ? "Loading station infrastructure data..."
            : backendError
            ? backendError
            : `${backendRecordCount} infrastructure record${
                backendRecordCount === 1 ? "" : "s"
              } loaded from the POLARIS backend.`}
        </span>
      </div>

      {/* ===================================================
          OVERVIEW
      =================================================== */}

      <section className="infra-overview">
        <div
          className="infra-overview-photo"
          style={{
            backgroundImage: `linear-gradient(
              90deg,
              rgba(2, 25, 34, .96) 0%,
              rgba(2, 25, 34, .76) 43%,
              rgba(2, 25, 34, .15) 100%
            ), url("${
              stationId === "bharati"
                ? "/images/stations/bharati-hero.jpg"
                : "/images/stations/maitri-hero.jpg"
            }")`,
          }}
        >
          <div className="infra-overview-content">
            <span>
              INDIAN ANTARCTIC PROGRAMME
            </span>

            <h2>
              {station.name} Research Station
            </h2>

            <p>{station.region}</p>

            <div className="infra-health-row">
              <div className="infra-health-number">
                {station.infrastructure.overallHealth}
                <small>%</small>
              </div>

              <div>
                <span>
                  DIGITAL TWIN HEALTH INDEX
                </span>

                <strong>
                  {warningCount > 0
                    ? "Infrastructure monitoring required"
                    : "Infrastructure nominal"}
                </strong>
              </div>
            </div>
          </div>

          <div className="infra-overview-status">
            <span />
            STATION ONLINE
          </div>
        </div>
      </section>

      {/* ===================================================
          SUMMARY
      =================================================== */}

      <section className="infra-summary">

        <div>
          <span>OVERALL HEALTH</span>

          <strong>
            {station.infrastructure.overallHealth}%
          </strong>

          <small>
            Composite infrastructure index
          </small>
        </div>

        <div>
          <span>POWER GENERATION</span>

          <strong>
            {station.energy.generation} kW
          </strong>

          <small>
            {station.energy.generatorLoad}%
            generator load
          </small>
        </div>

        <div>
          <span>COMMUNICATION LINK</span>

          <strong>
            {station.communications.latency} ms
          </strong>

          <small>
            {station.communications.downlink}
            Mbps downlink
          </small>
        </div>

        <div>
          <span>BACKEND INFRASTRUCTURE</span>

          <strong>
            {backendRecordCount}
          </strong>

          <small>
            Infrastructure record
            {backendRecordCount === 1
              ? ""
              : "s"}
            loaded
          </small>
        </div>

      </section>

      {/* ===================================================
          CRITICAL SYSTEMS
      =================================================== */}

      <div className="infra-section-heading">
        <div>
          <span>
            PHYSICAL INFRASTRUCTURE
          </span>

          <h2>Critical Systems</h2>
        </div>

        <div className="infra-live">
          <span />
          BACKEND CONNECTED
        </div>
      </div>

      <section className="infra-system-grid">
        {systems.map((system) => (
          <SystemCard
            key={system.title}
            {...system}
          />
        ))}
      </section>

      {/* ===================================================
          BOTTOM GRID
      =================================================== */}

      <section className="infra-bottom-grid">

        {/* =================================================
            SUBSYSTEM HEALTH
        ================================================= */}

        <div className="infra-panel">

          <div className="infra-panel-heading">
            <div>
              <span>DIGITAL TWIN</span>

              <h2>Subsystem Health</h2>
            </div>

            <Activity size={22} />
          </div>

          <div className="infra-component-list">
            {componentRows.map(
              (component) => (
                <div
                  className="infra-component"
                  key={component.name}
                >
                  <div className="infra-component-name">

                    <div className="infra-component-icon">
                      {component.icon}
                    </div>

                    <div>
                      <strong>
                        {component.name}
                      </strong>

                      <span>
                        {component.name ===
                        primaryInfrastructure?.name
                          ? "BACKEND INFRASTRUCTURE RECORD"
                          : "PROTOTYPE SENSOR GROUP"}
                      </span>
                    </div>

                  </div>

                  <div className="infra-component-value">

                    <strong>
                      {component.value}
                    </strong>

                    <span
                      className={
                        component.status
                      }
                    >
                      <i />
                      {component.status.toUpperCase()}
                    </span>

                  </div>
                </div>
              )
            )}
          </div>

        </div>

        {/* =================================================
            MAINTENANCE
        ================================================= */}

        <div className="infra-panel maintenance-panel">

          <div className="infra-panel-heading">
            <div>
              <span>
                PREDICTIVE MAINTENANCE
              </span>

              <h2>
                System Intelligence
              </h2>
            </div>

            <Wrench size={22} />
          </div>

          <div
            className={`maintenance-state ${
              warningCount > 0
                ? "maintenance-warning"
                : ""
            }`}
          >
            {warningCount > 0 ? (
              <AlertTriangle size={30} />
            ) : (
              <CheckCircle2 size={30} />
            )}

            <div>
              <span>
                CURRENT ASSESSMENT
              </span>

              <strong>
                {warningCount > 0
                  ? `${warningCount} subsystem${
                      warningCount === 1
                        ? ""
                        : "s"
                    } requires attention`
                  : "No critical anomalies detected"}
              </strong>
            </div>
          </div>

          {/* GENERATOR LOAD */}

          <div className="maintenance-item">
            <span>
              GENERATOR LOAD
            </span>

            <div>
              <strong>
                {station.energy.generatorLoad}%
              </strong>

              <div className="infra-progress">
                <i
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(
                        100,
                        station.energy
                          .generatorLoad
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* INFRASTRUCTURE HEALTH */}

          <div className="maintenance-item">
            <span>
              INFRASTRUCTURE HEALTH
            </span>

            <div>
              <strong>
                {station.infrastructure.overallHealth}%
              </strong>

              <div className="infra-progress">
                <i
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(
                        100,
                        station.infrastructure
                          .overallHealth
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* FUEL */}

          <div className="maintenance-item">
            <span>
              FUEL RESERVE
            </span>

            <div>
              <strong>
                {station.energy.fuelReserve}%
              </strong>

              <div className="infra-progress">
                <i
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(
                        100,
                        station.energy
                          .fuelReserve
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* BACKEND RECORD */}

          <div className="infra-ai-note">

            <Activity size={18} />

            <div>
              <span>
                POLARIS BACKEND
              </span>

              <p>
                {primaryInfrastructure
                  ? `${primaryInfrastructure.name} is registered for ${station.name} with status ${primaryInfrastructure.status}.`
                  : `No infrastructure record is currently registered for ${station.name}.`}
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}