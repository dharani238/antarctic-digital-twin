import { useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  Clock3,
  Filter,
  Radio,
  Search,
  ShieldCheck,
  Snowflake,
  TriangleAlert,
  Wifi,
  Zap,
  Fuel,
  Thermometer,
  Server,
  Check,
  X,
} from "lucide-react";

import "./Alerts.css";

type Severity = "critical" | "warning" | "advisory";
type AlertStatus = "active" | "acknowledged" | "resolved";
type Station = "bharati" | "maitri";

interface AlertRecord {
  id: string;
  station: Station;
  subsystem: string;
  title: string;
  description: string;
  severity: Severity;
  status: AlertStatus;
  time: string;
  source: string;
}

const initialAlerts: AlertRecord[] = [
  {
    id: "ALT-BHR-1042",
    station: "bharati",
    subsystem: "Power Generation",
    title: "Generator load above nominal band",
    description:
      "Generator load has remained above the simulated nominal operating band. Continued monitoring is recommended.",
    severity: "warning",
    status: "active",
    time: "00:18 IST",
    source: "GEN-02",
  },
  {
    id: "ALT-BHR-1038",
    station: "bharati",
    subsystem: "Environment",
    title: "Reduced external visibility",
    description:
      "Simulated visibility has fallen below the configured environmental monitoring threshold during drifting snow conditions.",
    severity: "advisory",
    status: "acknowledged",
    time: "23:46 IST",
    source: "ENV-VIS-01",
  },
  {
    id: "ALT-BHR-1034",
    station: "bharati",
    subsystem: "Communications",
    title: "Satellite latency excursion",
    description:
      "Communications latency temporarily exceeded the prototype threshold before returning to the expected operating range.",
    severity: "advisory",
    status: "resolved",
    time: "22:51 IST",
    source: "COM-SAT-01",
  },
  {
    id: "ALT-BHR-1029",
    station: "bharati",
    subsystem: "Fuel System",
    title: "Fuel endurance monitoring threshold",
    description:
      "Projected fuel endurance entered the configured monitoring window. No immediate operational intervention is indicated.",
    severity: "warning",
    status: "acknowledged",
    time: "21:35 IST",
    source: "FUEL-01",
  },
  {
    id: "ALT-MTR-0917",
    station: "maitri",
    subsystem: "HVAC",
    title: "Heating loop temperature deviation",
    description:
      "A simulated heating-loop temperature deviation was detected and subsequently returned to the nominal band.",
    severity: "warning",
    status: "resolved",
    time: "19:42 IST",
    source: "HVAC-TEMP-03",
  },
];

function severityIcon(subsystem: string) {
  if (subsystem.includes("Power")) return Zap;
  if (subsystem.includes("Fuel")) return Fuel;
  if (subsystem.includes("Environment")) return Snowflake;
  if (subsystem.includes("Communications")) return Wifi;
  if (subsystem.includes("HVAC")) return Thermometer;
  return Server;
}

export default function Alerts() {
  const [station, setStation] = useState<Station>("bharati");
  const [alerts, setAlerts] = useState<AlertRecord[]>(initialAlerts);
  const [filter, setFilter] = useState<"all" | AlertStatus>("all");
  const [search, setSearch] = useState("");

  const stationAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesStation = alert.station === station;

      const matchesStatus =
        filter === "all" || alert.status === filter;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        alert.title.toLowerCase().includes(query) ||
        alert.subsystem.toLowerCase().includes(query) ||
        alert.id.toLowerCase().includes(query) ||
        alert.source.toLowerCase().includes(query);

      return matchesStation && matchesStatus && matchesSearch;
    });
  }, [alerts, station, filter, search]);

  const activeCount = alerts.filter(
    (a) => a.station === station && a.status === "active"
  ).length;

  const acknowledgedCount = alerts.filter(
    (a) => a.station === station && a.status === "acknowledged"
  ).length;

  const resolvedCount = alerts.filter(
    (a) => a.station === station && a.status === "resolved"
  ).length;

  const warningCount = alerts.filter(
    (a) =>
      a.station === station &&
      a.status !== "resolved" &&
      a.severity === "warning"
  ).length;

  function acknowledgeAlert(id: string) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, status: "acknowledged" }
          : alert
      )
    );
  }

  function resolveAlert(id: string) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id ? { ...alert, status: "resolved" } : alert
      )
    );
  }

  return (
    <div className="alerts-page">
      <header className="alerts-header">
        <div>
          <div className="alerts-kicker">
            POLARIS / OPERATIONS / ALERT MANAGEMENT
          </div>

          <h1>Operational Alerts</h1>

          <p>
            Event monitoring, acknowledgement and resolution console for
            simulated Antarctic station telemetry.
          </p>
        </div>

        <div className="alerts-station-control">
          <span>ACTIVE STATION</span>

          <div className="alerts-station-buttons">
            <button
              className={station === "maitri" ? "selected" : ""}
              onClick={() => setStation("maitri")}
            >
              MAITRI
            </button>

            <button
              className={station === "bharati" ? "selected" : ""}
              onClick={() => setStation("bharati")}
            >
              BHARATI
            </button>
          </div>
        </div>
      </header>

      <section className="alerts-system-strip">
        <div>
          <span className="alerts-online-dot" />
          <strong>ALERT ENGINE ONLINE</strong>
          <span className="alerts-separator" />
          SIMULATED EVENT MONITORING
        </div>

        <div className="alerts-system-meta">
          <span>
            STATION <strong>{station.toUpperCase()}</strong>
          </span>

          <span>
            ENGINE <strong>POLARIS-AEM 1.0</strong>
          </span>

          <span>
            MODE <strong>DECISION SUPPORT</strong>
          </span>
        </div>
      </section>

      <section className="alerts-policy">
        <ShieldCheck size={17} />

        <strong>PROTOTYPE DATA POLICY</strong>

        <span>
          Alerts displayed on this page are generated from simulated telemetry
          for SIH prototype demonstration. They are not live NCPOR operational
          alerts.
        </span>
      </section>

      <section className="alerts-summary">
        <SummaryCard
          label="ACTIVE ALERTS"
          value={activeCount}
          description="Requires operator review"
          icon={BellRing}
          tone={activeCount > 0 ? "warning" : "normal"}
        />

        <SummaryCard
          label="ACKNOWLEDGED"
          value={acknowledgedCount}
          description="Under monitoring"
          icon={Clock3}
          tone="neutral"
        />

        <SummaryCard
          label="RESOLVED"
          value={resolvedCount}
          description="Closed events"
          icon={CheckCircle2}
          tone="normal"
        />

        <SummaryCard
          label="WARNING STATE"
          value={warningCount}
          description="Open warning-level events"
          icon={TriangleAlert}
          tone={warningCount > 0 ? "warning" : "normal"}
        />
      </section>

      <section className="alerts-console">
        <div className="alerts-console-header">
          <div>
            <span className="alerts-section-label">
              EVENT MANAGEMENT
            </span>

            <h2>Station Alert Queue</h2>
          </div>

          <div className="alerts-live">
            <Radio size={14} />
            LIVE CONSOLE
          </div>
        </div>

        <div className="alerts-toolbar">
          <div className="alerts-search">
            <Search size={17} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search alert ID, subsystem or source..."
            />
          </div>

          <div className="alerts-filter">
            <Filter size={15} />

            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              ALL
            </button>

            <button
              className={filter === "active" ? "active" : ""}
              onClick={() => setFilter("active")}
            >
              ACTIVE
            </button>

            <button
              className={filter === "acknowledged" ? "active" : ""}
              onClick={() => setFilter("acknowledged")}
            >
              ACKNOWLEDGED
            </button>

            <button
              className={filter === "resolved" ? "active" : ""}
              onClick={() => setFilter("resolved")}
            >
              RESOLVED
            </button>
          </div>
        </div>

        <div className="alerts-table-heading">
          <span>EVENT</span>
          <span>SEVERITY</span>
          <span>STATUS</span>
          <span>TIME</span>
          <span>ACTION</span>
        </div>

        <div className="alerts-list">
          {stationAlerts.length === 0 ? (
            <div className="alerts-empty">
              <CheckCircle2 size={31} />

              <strong>No matching events</strong>

              <span>
                No alerts match the current station, status and search filters.
              </span>
            </div>
          ) : (
            stationAlerts.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                onAcknowledge={acknowledgeAlert}
                onResolve={resolveAlert}
              />
            ))
          )}
        </div>
      </section>

      <section className="alerts-bottom-grid">
        <div className="alerts-health-panel">
          <div className="alerts-small-heading">
            <div>
              <span>MONITORING STATUS</span>
              <h3>Subsystem Watch</h3>
            </div>

            <Server size={20} />
          </div>

          <SubsystemRow name="POWER GENERATION" status="MONITOR" />
          <SubsystemRow name="ENVIRONMENT" status="NOMINAL" />
          <SubsystemRow name="COMMUNICATIONS" status="NOMINAL" />
          <SubsystemRow name="FUEL & LOGISTICS" status="MONITOR" />
          <SubsystemRow name="HVAC" status="NOMINAL" />
        </div>

        <div className="alerts-procedure-panel">
          <div className="alerts-small-heading">
            <div>
              <span>OPERATOR WORKFLOW</span>
              <h3>Alert Handling Procedure</h3>
            </div>

            <ShieldCheck size={20} />
          </div>

          <div className="procedure-step">
            <strong>01</strong>
            <div>
              <b>Detect</b>
              <span>
                Telemetry exceeds a configured prototype threshold.
              </span>
            </div>
          </div>

          <div className="procedure-step">
            <strong>02</strong>
            <div>
              <b>Acknowledge</b>
              <span>
                Operator confirms the event has been reviewed.
              </span>
            </div>
          </div>

          <div className="procedure-step">
            <strong>03</strong>
            <div>
              <b>Assess</b>
              <span>
                Cross-check infrastructure, environment and forecast context.
              </span>
            </div>
          </div>

          <div className="procedure-step">
            <strong>04</strong>
            <div>
              <b>Resolve</b>
              <span>
                Close the event after the simulated condition returns to an
                acceptable state.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  tone: "normal" | "warning" | "neutral";
}) {
  return (
    <div className={`alert-summary-card ${tone}`}>
      <div className="summary-icon">
        <Icon size={20} />
      </div>

      <span>{label}</span>

      <strong>{value.toString().padStart(2, "0")}</strong>

      <small>{description}</small>
    </div>
  );
}

function AlertRow({
  alert,
  onAcknowledge,
  onResolve,
}: {
  alert: AlertRecord;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const Icon = severityIcon(alert.subsystem);

  return (
    <article className={`alert-row ${alert.severity}`}>
      <div className="alert-event">
        <div className={`alert-event-icon ${alert.severity}`}>
          <Icon size={19} />
        </div>

        <div>
          <div className="alert-event-meta">
            <span>{alert.id}</span>
            <span>{alert.source}</span>
            <span>{alert.subsystem.toUpperCase()}</span>
          </div>

          <h3>{alert.title}</h3>

          <p>{alert.description}</p>
        </div>
      </div>

      <div>
        <span className={`severity-badge ${alert.severity}`}>
          {alert.severity.toUpperCase()}
        </span>
      </div>

      <div>
        <span className={`status-badge ${alert.status}`}>
          {alert.status === "active"
            ? "ACTIVE"
            : alert.status === "acknowledged"
            ? "ACKNOWLEDGED"
            : "RESOLVED"}
        </span>
      </div>

      <div className="alert-time">
        <Clock3 size={14} />
        {alert.time}
      </div>

      <div className="alert-actions">
        {alert.status === "active" && (
          <button
            className="acknowledge-button"
            onClick={() => onAcknowledge(alert.id)}
          >
            <Check size={14} />
            ACK
          </button>
        )}

        {alert.status !== "resolved" && (
          <button
            className="resolve-button"
            onClick={() => onResolve(alert.id)}
          >
            <X size={14} />
            RESOLVE
          </button>
        )}

        {alert.status === "resolved" && (
          <span className="closed-label">
            <CheckCircle2 size={15} />
            CLOSED
          </span>
        )}
      </div>
    </article>
  );
}

function SubsystemRow({
  name,
  status,
}: {
  name: string;
  status: "NOMINAL" | "MONITOR";
}) {
  return (
    <div className="subsystem-row">
      <div>
        <span
          className={`subsystem-dot ${
            status === "NOMINAL" ? "nominal" : "monitor"
          }`}
        />

        {name}
      </div>

      <strong className={status === "NOMINAL" ? "nominal" : "monitor"}>
        {status}
      </strong>
    </div>
  );
}