import {
  AlertTriangle,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Fuel,
  Gauge,
  HeartPulse,
  MapPin,
  PackageCheck,
  Radio,
  Ship,
  ShieldCheck,
  Snowflake,
  Truck,
  Utensils,
  Waves,
  Wrench,
} from "lucide-react";

import { useStation } from "../context/StationContext";
import { stations } from "../data/stations";

import "./Logistics.css";

export default function Logistics() {
  const { stationId, setStationId } = useStation();

  const station = stations[stationId];
  const logistics = station.logistics;

  const fuelRisk =
    logistics.fuelReserveDays < 90 ? "MONITOR" : "STABLE";

  const spareRisk =
    logistics.criticalSpares < 85 ? "MONITOR" : "STABLE";

  const foodPercent = Math.min(
    (logistics.foodReserveDays / 150) * 100,
    100
  );

  const fuelPercent = Math.min(
    logistics.fuelReserveDays,
    100
  );

  return (
    <div className="logistics-page">

      {/* ================= HEADER ================= */}

      <section className="logistics-header">
        <div>
          <div className="logistics-eyebrow">
            <Radio size={14} />
            POLARIS / LOGISTICS NETWORK
          </div>

          <h1>Logistics & Resupply</h1>

          <p>
            Remote inventory monitoring, supply planning and logistics
            intelligence for India's Antarctic research stations.
          </p>
        </div>

        <div className="station-selector">
          <span>ACTIVE STATION</span>

          <div className="station-buttons">
            <button
              className={stationId === "maitri" ? "active" : ""}
              onClick={() => setStationId("maitri")}
            >
              MAITRI
            </button>

            <button
              className={stationId === "bharati" ? "active" : ""}
              onClick={() => setStationId("bharati")}
            >
              BHARATI
            </button>
          </div>
        </div>
      </section>

      {/* ================= POLICY ================= */}

      <section className="prototype-notice">
        <ShieldCheck size={18} />

        <strong>PROTOTYPE DATA POLICY</strong>

        <span>
          Logistics quantities and operational status shown on this
          page are simulated for Digital Twin demonstration.
        </span>
      </section>

      {/* ================= HERO ================= */}

      <section className="logistics-hero">

        <div className="hero-background" />

        <div className="hero-overlay" />

        <div className="hero-content">

          <div className="network-status">
            <span className="online-dot" />
            LOGISTICS NETWORK ONLINE
          </div>

          <div className="hero-icon">
            <Boxes size={31} />
          </div>

          <span className="hero-eyebrow">
            ANTARCTIC SUPPLY NETWORK
          </span>

          <h2>{station.name} Logistics Control</h2>

          <p className="hero-description">
            Monitoring critical reserves, transportation assets and
            simulated resupply requirements for continuous station
            operations.
          </p>

          <div className="hero-location">
            <MapPin size={15} />
            ACTIVE ANTARCTIC OPERATIONS NODE
          </div>

          <div className="hero-stats">

            <div>
              <span>FOOD ENDURANCE</span>
              <strong>{logistics.foodReserveDays}</strong>
              <small>DAYS</small>
            </div>

            <div>
              <span>FUEL ENDURANCE</span>
              <strong>{logistics.fuelReserveDays}</strong>
              <small>DAYS</small>
            </div>

            <div>
              <span>MEDICAL STOCK</span>
              <strong>{logistics.medicalStock}%</strong>
              <small>AVAILABLE</small>
            </div>

            <div>
              <span>CRITICAL SPARES</span>
              <strong>{logistics.criticalSpares}%</strong>
              <small>AVAILABLE</small>
            </div>

          </div>
        </div>

        <div className="hero-system-card">
          <div>
            <span>SYSTEM STATUS</span>
            <strong>
              <span className="online-dot" />
              OPERATIONAL
            </strong>
          </div>

          <div>
            <span>NETWORK</span>
            <strong>POLARIS-LGS</strong>
          </div>

          <div>
            <span>MODE</span>
            <strong>DIGITAL TWIN</strong>
          </div>
        </div>
      </section>

      {/* ================= METRICS ================= */}

      <section className="logistics-metrics">

        <MetricCard
          icon={<Utensils size={23} />}
          label="FOOD RESERVE"
          value={`${logistics.foodReserveDays} days`}
          description="Estimated station endurance"
          percentage={foodPercent}
          status="STABLE"
        />

        <MetricCard
          icon={<Fuel size={23} />}
          label="FUEL RESERVE"
          value={`${logistics.fuelReserveDays} days`}
          description={`${fuelRisk} endurance status`}
          percentage={fuelPercent}
          status={fuelRisk}
        />

        <MetricCard
          icon={<HeartPulse size={23} />}
          label="MEDICAL STOCK"
          value={`${logistics.medicalStock}%`}
          description="Medical inventory readiness"
          percentage={logistics.medicalStock}
          status="STABLE"
        />

        <MetricCard
          icon={<Wrench size={23} />}
          label="CRITICAL SPARES"
          value={`${logistics.criticalSpares}%`}
          description={`${spareRisk} inventory status`}
          percentage={logistics.criticalSpares}
          status={spareRisk}
        />

      </section>

      {/* ================= OPERATIONS ================= */}

      <section className="section-heading">

        <div>
          <span>OPERATIONAL NETWORK</span>
          <h2>Antarctic Supply Operations</h2>
          <p>
            Integrated maritime, surface and inventory logistics
            supporting remote Antarctic operations.
          </p>
        </div>

        <PackageCheck size={30} />

      </section>

      <section className="operations-grid">

        <article className="operation-card operation-large supply-image">

          <div className="operation-gradient" />

          <div className="operation-content">

            <div className="operation-icon">
              <Ship size={28} />
            </div>

            <span>MARITIME LOGISTICS</span>

            <h3>Antarctic Resupply Mission</h3>

            <p>
              Maritime transport forms a major component of Antarctic
              logistics, moving fuel, food, equipment and scientific
              cargo between support ports and research stations.
            </p>

            <div className="operation-status">
              <span className="online-dot" />
              RESUPPLY MODEL ACTIVE
            </div>

          </div>
        </article>

        <article className="operation-card vehicle-image">

          <div className="operation-gradient" />

          <div className="operation-content">

            <div className="operation-icon">
              <Truck size={27} />
            </div>

            <span>SURFACE TRANSPORT</span>

            <h3>Polar Mobility</h3>

            <p>
              Ground transport supports personnel movement and
              cargo transfer across the Antarctic operating
              environment.
            </p>

            <div className="operation-status">
              <span className="online-dot" />
              VEHICLE READY
            </div>

          </div>
        </article>

        <article className="operation-card cargo-image">

          <div className="operation-gradient" />

          <div className="operation-content">

            <div className="operation-icon">
              <Boxes size={27} />
            </div>

            <span>CARGO MANAGEMENT</span>

            <h3>Supply Inventory</h3>

            <p>
              Critical supplies are categorized and tracked to
              support remote operational planning.
            </p>

            <div className="operation-status">
              <span className="online-dot" />
              INVENTORY TRACKED
            </div>

          </div>
        </article>

      </section>

      {/* ================= CONTROL GRID ================= */}

      <section className="control-grid">

        {/* INVENTORY */}

        <div className="control-panel">

          <PanelHeader
            eyebrow="INVENTORY CONTROL"
            title="Critical Resource Status"
            icon={<Boxes size={25} />}
          />

          <div className="resource-list">

            <Resource
              icon={<Utensils size={18} />}
              name="Food Supplies"
              sub="Station provisions"
              value={`${logistics.foodReserveDays} days`}
            />

            <Resource
              icon={<Fuel size={18} />}
              name="Fuel Supply"
              sub="Operational endurance"
              value={`${logistics.fuelReserveDays} days`}
            />

            <Resource
              icon={<HeartPulse size={18} />}
              name="Medical Inventory"
              sub="Medical readiness"
              value={`${logistics.medicalStock}%`}
            />

            <Resource
              icon={<Wrench size={18} />}
              name="Critical Spares"
              sub="Engineering components"
              value={`${logistics.criticalSpares}%`}
            />

          </div>
        </div>

        {/* TIMELINE */}

        <div className="control-panel">

          <PanelHeader
            eyebrow="SUPPLY PIPELINE"
            title="Resupply Mission Status"
            icon={<Ship size={25} />}
          />

          <div className="mission-timeline">

            <Timeline
              state="complete"
              phase="PHASE 01"
              title="Supply Planning"
              description="Cargo requirements evaluated."
            />

            <Timeline
              state="complete"
              phase="PHASE 02"
              title="Cargo Preparation"
              description="Priority inventory prepared for transport."
            />

            <Timeline
              state="active"
              phase="PHASE 03"
              title="Transit Simulation"
              description="POLARIS monitoring simulated mission progress."
            />

            <Timeline
              state="pending"
              phase="PHASE 04"
              title="Station Delivery"
              description="Antarctic cargo transfer and verification."
            />

          </div>
        </div>

        {/* AI */}

        <div className="control-panel ai-panel">

          <PanelHeader
            eyebrow="POLARIS AI"
            title="Resupply Intelligence"
            icon={<BrainCircuit size={26} />}
          />

          <div className="ai-engine">

            <div className="ai-orb">
              <BrainCircuit size={32} />
            </div>

            <div>
              <strong>LOGISTICS MODEL ACTIVE</strong>
              <span>
                Evaluating consumption and inventory endurance
              </span>
            </div>

          </div>

          <div className="ai-recommendation">

            <span>AI RECOMMENDATION</span>

            <strong>
              {logistics.fuelReserveDays < 90
                ? "Prioritize fuel in the next simulated resupply window."
                : "Current reserve levels support continued operations."}
            </strong>

            <p>
              POLARIS compares simulated consumption rates,
              reserve endurance and critical inventory levels
              to identify potential resupply priorities.
            </p>

            <div className="confidence-row">
              <span>MODEL CONFIDENCE</span>
              <b>91%</b>
            </div>

            <div className="confidence-track">
              <i />
            </div>

          </div>
        </div>

        {/* READINESS */}

        <div className="control-panel">

          <PanelHeader
            eyebrow="LOGISTICS RISK"
            title="Operational Readiness"
            icon={<Gauge size={26} />}
          />

          <div className="readiness-list">

            <Readiness
              label="FOOD SECURITY"
              status="STABLE"
            />

            <Readiness
              label="FUEL ENDURANCE"
              status={fuelRisk}
            />

            <Readiness
              label="MEDICAL READINESS"
              status="STABLE"
            />

            <Readiness
              label="CRITICAL SPARES"
              status={spareRisk}
            />

          </div>

          <div className="readiness-summary">

            <div className="readiness-icon">
              <ShieldCheck size={25} />
            </div>

            <div>
              <span>OVERALL LOGISTICS STATE</span>
              <strong>
                {fuelRisk === "STABLE" &&
                spareRisk === "STABLE"
                  ? "NOMINAL"
                  : "MONITOR REQUIRED"}
              </strong>
            </div>

          </div>

        </div>

      </section>

      {/* ================= NETWORK ================= */}

      <section className="network-panel">

        <div className="network-left">

          <div className="network-icon">
            <Waves size={27} />
          </div>

          <div>
            <span>POLARIS LOGISTICS NETWORK</span>
            <h3>Remote Supply Intelligence Active</h3>
            <p>
              Digital Twin monitoring is evaluating simulated
              station inventory, endurance and logistics requirements.
            </p>
          </div>

        </div>

        <div className="network-meta">

          <div>
            <span>CONNECTION</span>
            <strong>
              <i className="online-dot" />
              ONLINE
            </strong>
          </div>

          <div>
            <span>SIMULATION</span>
            <strong>ACTIVE</strong>
          </div>

          <div>
            <span>UPDATE CYCLE</span>
            <strong>
              <Clock3 size={13} />
              LIVE
            </strong>
          </div>

        </div>

      </section>

      <footer className="logistics-footer">
        <span>
          POLARIS • ANTARCTIC LOGISTICS INTELLIGENCE
        </span>

        <span>
          DIGITAL TWIN PROTOTYPE • SIH26060
        </span>
      </footer>

    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function MetricCard({
  icon,
  label,
  value,
  description,
  percentage,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  percentage: number;
  status: string;
}) {
  return (
    <div className="metric-card">

      <div className="metric-top">
        <div className="metric-icon">{icon}</div>

        <div
          className={
            status === "MONITOR"
              ? "metric-status warning"
              : "metric-status"
          }
        >
          {status === "MONITOR" ? (
            <AlertTriangle size={12} />
          ) : (
            <CheckCircle2 size={12} />
          )}

          {status}
        </div>
      </div>

      <span className="metric-label">{label}</span>

      <strong className="metric-value">{value}</strong>

      <p>{description}</p>

      <div className="metric-progress">
        <i
          style={{
            width: `${Math.max(
              0,
              Math.min(percentage, 100)
            )}%`,
          }}
        />
      </div>

    </div>
  );
}

function PanelHeader({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="panel-header">

      <div>
        <span>{eyebrow}</span>
        <h3>{title}</h3>
      </div>

      <div className="panel-header-icon">
        {icon}
      </div>

    </div>
  );
}

function Resource({
  icon,
  name,
  sub,
  value,
}: {
  icon: React.ReactNode;
  name: string;
  sub: string;
  value: string;
}) {
  return (
    <div className="resource-row">

      <div className="resource-main">

        <div className="resource-icon">
          {icon}
        </div>

        <div>
          <strong>{name}</strong>
          <span>{sub}</span>
        </div>

      </div>

      <b>{value}</b>

    </div>
  );
}

function Timeline({
  state,
  phase,
  title,
  description,
}: {
  state: "complete" | "active" | "pending";
  phase: string;
  title: string;
  description: string;
}) {
  return (
    <div className={`timeline-item ${state}`}>

      <div className="timeline-node">
        {state === "complete" ? (
          <CheckCircle2 size={16} />
        ) : state === "active" ? (
          <Ship size={16} />
        ) : (
          <Snowflake size={16} />
        )}
      </div>

      <div>
        <span>{phase}</span>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

    </div>
  );
}

function Readiness({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  const warning = status === "MONITOR";

  return (
    <div className="readiness-row">

      <span>{label}</span>

      <strong className={warning ? "warning" : ""}>
        {warning ? (
          <AlertTriangle size={15} />
        ) : (
          <CheckCircle2 size={15} />
        )}

        {status}
      </strong>

    </div>
  );
}