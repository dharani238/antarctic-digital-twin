import { useMemo, useState } from "react";

import {
  Activity,
  BatteryCharging,
  ChevronRight,
  Cpu,
  Droplets,
  Fuel,
  Gauge,
  MapPin,
  Radio,
  Server,
  ShieldCheck,
  Snowflake,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";

import { useStation } from "../context/StationContext";
import { stations } from "../data/stations";

import "./DigitalTwin.css";

type SystemKey =
  | "power"
  | "hvac"
  | "communications"
  | "water"
  | "research";

type SystemInfo = {
  key: SystemKey;
  name: string;
  code: string;
  health: number;
  status: string;
  detail: string;
  description: string;
  image: string;
  icon: React.ReactNode;
};

export default function DigitalTwin() {
  const { stationId, setStationId } = useStation();
  const station = stations[stationId];

  const [selectedSystem, setSelectedSystem] =
    useState<SystemKey>("power");

  /*
   * Images are served from public/images.
   * These paths match the image folders already in the project.
   */
  const stationImage =
    stationId === "bharati"
      ? "/images/stations/bharati-aerial.jpg"
      : "/images/stations/maitri-hero.jpg";

  const systems: SystemInfo[] = useMemo(
    () => [
      {
        key: "power",
        name: "Power System",
        code: "PWR-01",
        health: 96,
        status: "Nominal",
        detail: `${station.energy.generation} kW generation`,
        description:
          "Primary generation, distribution and station electrical load.",
        image: "/images/infrastructure/power.jpg",
        icon: <Zap size={19} />,
      },
      {
        key: "hvac",
        name: "HVAC",
        code: "ENV-04",
        health: 91,
        status: "Nominal",
        detail: "Thermal regulation active",
        description:
          "Heating, ventilation and internal thermal regulation.",
        image: "/images/infrastructure/hvac.jpg",
        icon: <Wind size={19} />,
      },
      {
        key: "communications",
        name: "Communications",
        code: "COM-01",
        health: 98,
        status: "Online",
        detail: `${station.communications.latency} ms link latency`,
        description:
          "Remote communications and satellite data connectivity.",
        image: "/images/infrastructure/communications.jpg",
        icon: <Radio size={19} />,
      },
      {
        key: "water",
        name: "Water System",
        code: "WTR-02",
        health: 94,
        status: "Nominal",
        detail: "Processing system available",
        description:
          "Water processing, storage and station distribution.",
        image: "/images/infrastructure/water-system.jpg",
        icon: <Droplets size={19} />,
      },
      {
        key: "research",
        name: "Research Systems",
        code: "LAB-03",
        health: 89,
        status: "Monitoring",
        detail: "Scientific systems synchronized",
        description:
          "Laboratory instrumentation and research data systems.",
        image: "/images/infrastructure/laboratory.jpg",
        icon: <Server size={19} />,
      },
    ],
    [station]
  );

  const activeSystem =
    systems.find((system) => system.key === selectedSystem) ??
    systems[0];

  const selectSystem = (key: SystemKey) => {
    setSelectedSystem(key);
  };

  return (
    <main className="twinPage">
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="twinTopbar">
        <div className="twinTopbarIdentity">
          <span className="twinLiveDot" />

          <div>
            <strong>Digital Twin</strong>
            <span>Antarctic station operational model</span>
          </div>
        </div>

        <div className="twinTopbarRight">
          <div className="twinSyncState">
            <Activity size={14} />
            <span>SIMULATION SYNCHRONIZED</span>
          </div>

          <div className="twinStationSelector">
            <button
              type="button"
              className={stationId === "bharati" ? "active" : ""}
              onClick={() => setStationId("bharati")}
            >
              Bharati
            </button>

            <button
              type="button"
              className={stationId === "maitri" ? "active" : ""}
              onClick={() => setStationId("maitri")}
            >
              Maitri
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="twinHero">
        <img
          className="twinHeroImage"
          src={stationImage}
          alt={`${station.name} Antarctic Research Station`}
        />

        <div className="twinHeroOverlay" />
        <div className="twinHeroGrid" />

        <div className="twinHeroHeading">
          <div className="twinHeroTag">
            <MapPin size={13} />
            <span>{station.region}</span>
          </div>

          <h1>{station.name}</h1>

          <p>Station Digital Twin</p>

          <div className="twinCoordinates">
            {Math.abs(station.coordinates.latitude).toFixed(3)}°S
            <span />
            {station.coordinates.longitude.toFixed(3)}°E
          </div>
        </div>

        {/* POWER */}

        <button
          type="button"
          aria-label="Inspect power system"
          className={`twinHotspot twinHotspotPower ${
            selectedSystem === "power" ? "selected" : ""
          }`}
          onClick={() => selectSystem("power")}
        >
          <span className="twinHotspotPulse" />

          <span className="twinHotspotLabel">
            <small>PWR-01</small>
            <strong>POWER</strong>
          </span>
        </button>

        {/* HVAC */}

        <button
          type="button"
          aria-label="Inspect HVAC system"
          className={`twinHotspot twinHotspotHvac ${
            selectedSystem === "hvac" ? "selected" : ""
          }`}
          onClick={() => selectSystem("hvac")}
        >
          <span className="twinHotspotPulse" />

          <span className="twinHotspotLabel">
            <small>ENV-04</small>
            <strong>HVAC</strong>
          </span>
        </button>

        {/* COMMUNICATIONS */}

        <button
          type="button"
          aria-label="Inspect communications system"
          className={`twinHotspot twinHotspotComms ${
            selectedSystem === "communications" ? "selected" : ""
          }`}
          onClick={() => selectSystem("communications")}
        >
          <span className="twinHotspotPulse" />

          <span className="twinHotspotLabel">
            <small>COM-01</small>
            <strong>COMMS</strong>
          </span>
        </button>

        {/* WATER */}

        <button
          type="button"
          aria-label="Inspect water system"
          className={`twinHotspot twinHotspotWater ${
            selectedSystem === "water" ? "selected" : ""
          }`}
          onClick={() => selectSystem("water")}
        >
          <span className="twinHotspotPulse" />

          <span className="twinHotspotLabel">
            <small>WTR-02</small>
            <strong>WATER</strong>
          </span>
        </button>

        {/* RESEARCH */}

        <button
          type="button"
          aria-label="Inspect research systems"
          className={`twinHotspot twinHotspotResearch ${
            selectedSystem === "research" ? "selected" : ""
          }`}
          onClick={() => selectSystem("research")}
        >
          <span className="twinHotspotPulse" />

          <span className="twinHotspotLabel">
            <small>LAB-03</small>
            <strong>RESEARCH</strong>
          </span>
        </button>

        {/* INSPECTOR */}

        <aside className="twinInspector">
          <div className="twinInspectorHeader">
            <div>
              <span>SYSTEM INSPECTOR</span>
              <h2>{activeSystem.name}</h2>
            </div>

            <div className="twinInspectorIcon">
              {activeSystem.icon}
            </div>
          </div>

          <div className="twinInspectorStatus">
            <span>
              <i />
              {activeSystem.status}
            </span>

            <small>{activeSystem.code}</small>
          </div>

          <div className="twinInspectorHealth">
            <div className="twinInspectorHealthTop">
              <span>System health</span>
              <strong>{activeSystem.health}%</strong>
            </div>

            <div className="twinHealthTrack">
              <span
                style={{
                  width: `${activeSystem.health}%`,
                }}
              />
            </div>
          </div>

          <div className="twinInspectorDetail">
            <span>CURRENT STATE</span>
            <strong>{activeSystem.detail}</strong>
          </div>

          <p className="twinInspectorDescription">
            {activeSystem.description}
          </p>

          <div className="twinInspectorMeta">
            <div>
              <span>Telemetry</span>
              <strong>Available</strong>
            </div>

            <div>
              <span>Alerts</span>
              <strong>None critical</strong>
            </div>
          </div>

          <div className="twinInspectorFooter">
            <Activity size={13} />
            Simulated operational telemetry
          </div>
        </aside>

        {/* BOTTOM TELEMETRY */}

        <div className="twinHeroTelemetry">
          <div>
            <Thermometer size={18} />

            <span>
              <small>Temperature</small>
              <strong>
                {station.environment.temperature}°C
              </strong>
            </span>
          </div>

          <div>
            <Wind size={18} />

            <span>
              <small>Wind</small>
              <strong>
                {station.environment.windSpeed} km/h
              </strong>
            </span>
          </div>

          <div>
            <Zap size={18} />

            <span>
              <small>Demand</small>
              <strong>{station.energy.demand} kW</strong>
            </span>
          </div>

          <div>
            <Radio size={18} />

            <span>
              <small>Remote Link</small>
              <strong>
                {station.communications.latency} ms
              </strong>
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          DATA NOTICE
      ===================================================== */}

      <div className="twinDataNotice">
        <ShieldCheck size={16} />

        <span>
          Operational values displayed in this interface are
          simulated demonstration telemetry. Station identity and
          geographic information use public references.
        </span>
      </div>

      {/* =====================================================
          OPERATIONAL OVERVIEW
      ===================================================== */}

      <section className="twinSection">
        <div className="twinSectionHeader">
          <div>
            <span>STATION SYSTEMS</span>
            <h2>Operational Overview</h2>
            <p>
              Select an infrastructure subsystem to inspect its
              current simulated operational state.
            </p>
          </div>

          <div className="twinSectionStatus">
            <span />
            5 SYSTEMS MONITORED
          </div>
        </div>

        <div className="twinSystemsGrid">
          {systems.map((system) => (
            <button
              type="button"
              key={system.key}
              className={`twinSystemCard ${
                selectedSystem === system.key ? "active" : ""
              }`}
              onClick={() => selectSystem(system.key)}
            >
              {/* REAL SYSTEM IMAGE */}

              <div className="twinSystemImageWrap">
                <img
                  src={system.image}
                  alt={`${system.name} infrastructure`}
                  className="twinSystemImage"
                />

                <div className="twinSystemImageOverlay" />

                <span className="twinImageCode">
                  {system.code}
                </span>

                <span className="twinImageStatus">
                  <i />
                  {system.status}
                </span>
              </div>

              {/* CARD CONTENT */}

              <div className="twinSystemCardContent">
                <div className="twinSystemCardTop">
                  <div className="twinSystemIcon">
                    {system.icon}
                  </div>

                  <ChevronRight
                    className="twinSystemArrow"
                    size={18}
                  />
                </div>

                <div className="twinSystemIdentity">
                  <h3>{system.name}</h3>
                  <p>{system.description}</p>
                </div>

                <div className="twinSystemHealth">
                  <div>
                    <span>HEALTH</span>
                    <strong>{system.health}%</strong>
                  </div>

                  <div className="twinSystemTrack">
                    <span
                      style={{
                        width: `${system.health}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="twinSystemDetail">
                  <span>{system.detail}</span>
                  <span className="twinInspectText">
                    INSPECT
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          OPERATIONAL DATA
      ===================================================== */}

      <section className="twinOperationsGrid">
        {/* ENVIRONMENT */}

        <article className="twinPanel twinEnvironmentPanel">
          <div className="twinPanelHeader">
            <div>
              <span>ENVIRONMENT</span>
              <h2>External Conditions</h2>
            </div>

            <div className="twinPanelIcon">
              <Snowflake size={20} />
            </div>
          </div>

          <div className="twinEnvironmentMain">
            <div className="twinTemperature">
              <Thermometer size={23} />

              <div>
                <strong>
                  {station.environment.temperature}°
                </strong>
                <span>Celsius</span>
              </div>
            </div>

            <div className="twinWeatherState">
              <span>STATION CONDITION</span>
              <strong>Polar operations active</strong>
            </div>
          </div>

          <div className="twinEnvironmentMetrics">
            <div>
              <Wind size={17} />
              <span>Wind</span>
              <strong>
                {station.environment.windSpeed} km/h
              </strong>
            </div>

            <div>
              <Gauge size={17} />
              <span>Pressure</span>
              <strong>
                {station.environment.pressure} hPa
              </strong>
            </div>

            <div>
              <Droplets size={17} />
              <span>Humidity</span>
              <strong>
                {station.environment.humidity}%
              </strong>
            </div>
          </div>
        </article>

        {/* ENERGY */}

        <article className="twinPanel">
          <div className="twinPanelHeader">
            <div>
              <span>ENERGY SYSTEM</span>
              <h2>Power &amp; Endurance</h2>
            </div>

            <div className="twinPanelIcon">
              <Zap size={20} />
            </div>
          </div>

          <div className="twinEnergyRows">
            <MetricRow
              label="Station demand"
              value={`${station.energy.demand} kW`}
              percent={74}
            />

            <MetricRow
              label="Generation"
              value={`${station.energy.generation} kW`}
              percent={88}
            />

            <MetricRow
              label="Fuel reserve"
              value={`${station.energy.fuelReserve}%`}
              percent={station.energy.fuelReserve}
            />
          </div>

          <div className="twinFuelForecast">
            <div className="twinFuelIcon">
              <Fuel size={19} />
            </div>

            <div>
              <span>ESTIMATED ENDURANCE</span>
              <strong>
                {station.energy.estimatedFuelDays} days
              </strong>
            </div>
          </div>
        </article>

        {/* AI */}

        <article className="twinPanel twinAiPanel">
          <div className="twinPanelHeader">
            <div>
              <span>PREDICTIVE LAYER</span>
              <h2>Operational Intelligence</h2>
            </div>

            <div className="twinAiHeaderIcon">
              <Cpu size={20} />
            </div>
          </div>

          <div className="twinAiStatus">
            <div className="twinAiIcon">
              <Cpu size={18} />
            </div>

            <div>
              <span>ANALYTICS ENGINE</span>
              <strong>Simulation analysis active</strong>
            </div>

            <i />
          </div>

          <div className="twinPrediction">
            <BatteryCharging size={18} />

            <div>
              <span>ENERGY FORECAST</span>

              <strong>
                Heating demand sensitivity detected
              </strong>

              <p>
                Lower external temperature and stronger wind
                conditions may increase simulated thermal demand.
              </p>
            </div>
          </div>

          <div className="twinPrediction">
            <ShieldCheck size={18} />

            <div>
              <span>RESOURCE FORECAST</span>

              <strong>
                Fuel endurance within operating range
              </strong>

              <p>
                Simulated reserve supports approximately{" "}
                {station.energy.estimatedFuelDays} days of
                operation.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* =====================================================
          PIPELINE
      ===================================================== */}

      <section className="twinPipeline">
        <div className="twinSectionHeader">
          <div>
            <span>DATA ARCHITECTURE</span>
            <h2>Digital Twin Pipeline</h2>
            <p>
              From remote station telemetry to operational
              decision support.
            </p>
          </div>

          <span className="twinPipelineCaption">
            SIMULATED WORKFLOW
          </span>
        </div>

        <div className="twinPipelineFlow">
          <PipelineNode
            icon={<Activity size={19} />}
            title="Station Sensors"
            description="Telemetry acquisition"
          />

          <PipelineConnector />

          <PipelineNode
            icon={<Radio size={19} />}
            title="Remote Link"
            description="Satellite communication"
          />

          <PipelineConnector />

          <PipelineNode
            icon={<Server size={19} />}
            title="Digital Twin"
            description="State synchronization"
            active
          />

          <PipelineConnector />

          <PipelineNode
            icon={<Cpu size={19} />}
            title="Analytics"
            description="Predictive processing"
          />

          <PipelineConnector />

          <PipelineNode
            icon={<ShieldCheck size={19} />}
            title="Decision Support"
            description="Remote operations"
          />
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function MetricRow({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: number;
}) {
  return (
    <div className="twinMetricRow">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="twinMetricTrack">
        <span
          style={{
            width: `${Math.min(percent, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

function PipelineNode({
  icon,
  title,
  description,
  active = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={
        active
          ? "twinPipelineNode active"
          : "twinPipelineNode"
      }
    >
      <div className="twinPipelineIcon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
}

function PipelineConnector() {
  return (
    <div className="twinPipelineConnector">
      <span />
      <ChevronRight size={14} />
    </div>
  );
}