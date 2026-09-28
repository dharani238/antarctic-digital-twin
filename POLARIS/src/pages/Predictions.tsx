import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CloudSnow,
  Cpu,
  Fuel,
  Gauge,
  Radio,
  Server,
  ShieldCheck,
  Thermometer,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";

import { useStation } from "../context/StationContext";
import "./Predictions.css";

type ForecastPoint = {
  time: string;
  actual?: number;
  forecast: number;
  low: number;
  high: number;
};

type StationForecast = {
  name: string;
  code: string;
  risk: number;
  confidence: number;
  demandNow: number;
  demandPeak: number;
  fuelDays: number;
  anomalyScore: number;
  temperature: number;
  wind: number;
  visibility: number;
  pressure: number;
  weatherRisk: string;
  generatorLoad: number;
  batterySoc: number;
  dataCompleteness: number;
  lastSync: string;
  forecast: ForecastPoint[];
};

const stationForecasts: Record<"bharati" | "maitri", StationForecast> = {
  bharati: {
    name: "Bharati",
    code: "BHR",
    risk: 28,
    confidence: 94,
    demandNow: 356,
    demandPeak: 402,
    fuelDays: 84,
    anomalyScore: 0.31,
    temperature: -21.4,
    wind: 46,
    visibility: 5.7,
    pressure: 974,
    weatherRisk: "ELEVATED",
    generatorLoad: 74,
    batterySoc: 82,
    dataCompleteness: 96.8,
    lastSync: "23:31 IST",
    forecast: [
      { time: "NOW", actual: 356, forecast: 356, low: 346, high: 366 },
      { time: "+6h", actual: 361, forecast: 363, low: 350, high: 376 },
      { time: "+12h", actual: 369, forecast: 372, low: 357, high: 387 },
      { time: "+18h", forecast: 381, low: 363, high: 399 },
      { time: "+24h", forecast: 389, low: 369, high: 409 },
      { time: "+30h", forecast: 396, low: 374, high: 418 },
      { time: "+36h", forecast: 402, low: 377, high: 427 },
      { time: "+42h", forecast: 397, low: 372, high: 422 },
      { time: "+48h", forecast: 389, low: 365, high: 413 },
      { time: "+54h", forecast: 381, low: 358, high: 404 },
      { time: "+60h", forecast: 374, low: 352, high: 396 },
      { time: "+66h", forecast: 368, low: 347, high: 389 },
      { time: "+72h", forecast: 362, low: 342, high: 382 },
    ],
  },

  maitri: {
    name: "Maitri",
    code: "MTR",
    risk: 17,
    confidence: 96,
    demandNow: 312,
    demandPeak: 351,
    fuelDays: 103,
    anomalyScore: 0.18,
    temperature: -17.8,
    wind: 31,
    visibility: 8.4,
    pressure: 982,
    weatherRisk: "LOW",
    generatorLoad: 68,
    batterySoc: 88,
    dataCompleteness: 98.1,
    lastSync: "23:31 IST",
    forecast: [
      { time: "NOW", actual: 312, forecast: 312, low: 303, high: 321 },
      { time: "+6h", actual: 317, forecast: 318, low: 307, high: 329 },
      { time: "+12h", actual: 322, forecast: 324, low: 312, high: 336 },
      { time: "+18h", forecast: 330, low: 316, high: 344 },
      { time: "+24h", forecast: 337, low: 322, high: 352 },
      { time: "+30h", forecast: 344, low: 327, high: 361 },
      { time: "+36h", forecast: 351, low: 332, high: 370 },
      { time: "+42h", forecast: 347, low: 328, high: 366 },
      { time: "+48h", forecast: 341, low: 323, high: 359 },
      { time: "+54h", forecast: 334, low: 317, high: 351 },
      { time: "+60h", forecast: 328, low: 312, high: 344 },
      { time: "+66h", forecast: 322, low: 307, high: 337 },
      { time: "+72h", forecast: 318, low: 303, high: 333 },
    ],
  },
};

export default function Predictions() {
  const { stationId, setStationId } = useStation();

  const station =
    stationForecasts[stationId === "maitri" ? "maitri" : "bharati"];

  const isBharati = stationId === "bharati";

  return (
    <main className="ops-page">
      {/* HEADER */}

      <header className="ops-header">
        <div>
          <div className="ops-breadcrumb">
            POLARIS / FORECASTING / {station.code}
          </div>

          <h1>Operational Forecast</h1>

          <p>
            72-hour engineering outlook derived from simulated station
            telemetry, environmental observations and equipment-state data.
          </p>
        </div>

        <div className="ops-station-selector">
          <span>ACTIVE STATION</span>

          <div>
            <button
              className={!isBharati ? "active" : ""}
              onClick={() => setStationId("maitri")}
            >
              MAITRI
            </button>

            <button
              className={isBharati ? "active" : ""}
              onClick={() => setStationId("bharati")}
            >
              BHARATI
            </button>
          </div>
        </div>
      </header>

      {/* SYSTEM STATUS */}

      <section className="ops-status-strip">
        <div className="ops-status-left">
          <span className="ops-live-dot" />

          <strong>{station.code} FORECAST SERVICE</strong>

          <span>SIMULATION ACTIVE</span>
        </div>

        <div className="ops-status-meta">
          <span>
            LAST SYNC <strong>{station.lastSync}</strong>
          </span>

          <span>
            COMPLETENESS <strong>{station.dataCompleteness}%</strong>
          </span>

          <span>
            HORIZON <strong>72 H</strong>
          </span>
        </div>
      </section>

      {/* DATA POLICY */}

      <section className="ops-policy">
        <ShieldCheck size={17} />

        <strong>PROTOTYPE DATA MODE</strong>

        <span>
          Operational values and forecasts shown here are simulated for SIH
          demonstration. They are not live NCPOR telemetry.
        </span>
      </section>

      {/* SUMMARY */}

      <section className="ops-summary-grid">
        <MetricCard
          icon={<Zap size={19} />}
          source="PWR-BUS-01"
          label="STATION LOAD"
          value={`${station.demandNow} kW`}
          detail={`Forecast peak ${station.demandPeak} kW`}
          status="NOMINAL"
        />

        <MetricCard
          icon={<Fuel size={19} />}
          source="FUEL-TK-01"
          label="FUEL ENDURANCE"
          value={`${station.fuelDays} d`}
          detail={`${station.generatorLoad}% generator load`}
          status="NOMINAL"
        />

        <MetricCard
          icon={<CloudSnow size={19} />}
          source="AWS-01"
          label="WEATHER EXPOSURE"
          value={station.weatherRisk}
          detail={`${station.wind} km/h wind`}
          status={isBharati ? "WATCH" : "NOMINAL"}
        />

        <MetricCard
          icon={<Activity size={19} />}
          source="ANM-CORE"
          label="ANOMALY INDEX"
          value={station.anomalyScore.toFixed(2)}
          detail="Cross-system deviation"
          status={isBharati ? "WATCH" : "NOMINAL"}
        />
      </section>

      {/* FORECAST */}

      <section className="ops-section">
        <div className="ops-section-title">
          <div>
            <span>ENERGY FORECAST / MODEL EF-04</span>
            <h2>Station Electrical Demand</h2>
          </div>

          <div className="ops-model-state">
            <span className="ops-live-dot" />
            MODEL AVAILABLE
          </div>
        </div>

        <div className="ops-forecast-layout">
          <div className="ops-panel ops-chart-panel">
            <div className="ops-panel-header">
              <div>
                <span>72-HOUR LOAD PROJECTION</span>
                <h3>Observed & Forecast Demand</h3>
              </div>

              <div className="ops-legend">
                <span>
                  <i className="legend-actual" />
                  Observed
                </span>

                <span>
                  <i className="legend-forecast" />
                  Forecast
                </span>

                <span>
                  <i className="legend-band" />
                  Confidence range
                </span>
              </div>
            </div>

            <ForecastChart
              data={station.forecast}
              peak={station.demandPeak}
            />

            <div className="ops-chart-caption">
              <span>UNIT: kW</span>
              <span>INTERVAL: 6 HOURS</span>
              <span>FORECAST CONFIDENCE: {station.confidence}%</span>
            </div>
          </div>

          <aside className="ops-panel ops-forecast-side">
            <div className="ops-side-heading">
              <TrendingUp size={19} />

              <div>
                <span>FORECAST SUMMARY</span>
                <strong>EF-04 / 72H</strong>
              </div>
            </div>

            <DataRow
              label="Current demand"
              value={`${station.demandNow} kW`}
            />

            <DataRow
              label="Predicted peak"
              value={`${station.demandPeak} kW`}
            />

            <DataRow
              label="Peak window"
              value="+36 h"
            />

            <DataRow
              label="Model confidence"
              value={`${station.confidence}%`}
            />

            <DataRow
              label="Generator loading"
              value={`${station.generatorLoad}%`}
            />

            <DataRow
              label="Battery SOC"
              value={`${station.batterySoc}%`}
            />

            <div className="ops-source-box">
              <span>INPUT SOURCES</span>

              <p>
                PWR-BUS-01 · DG-01 · DG-02
                <br />
                AWS-01 · HVAC-03 · FUEL-TK-01
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ENVIRONMENT */}

      <section className="ops-section">
        <div className="ops-section-title">
          <div>
            <span>ENVIRONMENTAL INPUT / AWS-01</span>
            <h2>Forecast Drivers</h2>
          </div>

          <CloudSnow size={22} />
        </div>

        <div className="ops-driver-grid">
          <DriverCard
            icon={<Thermometer size={18} />}
            id="AWS-01/TEMP"
            label="EXTERNAL TEMPERATURE"
            value={`${station.temperature}°C`}
            change={isBharati ? "Heating load elevated" : "Within expected range"}
          />

          <DriverCard
            icon={<CloudSnow size={18} />}
            id="AWS-01/WIND"
            label="WIND SPEED"
            value={`${station.wind} km/h`}
            change={isBharati ? "Exposure increasing" : "Stable"}
          />

          <DriverCard
            icon={<Gauge size={18} />}
            id="AWS-01/PRES"
            label="PRESSURE"
            value={`${station.pressure} hPa`}
            change="Atmospheric input"
          />

          <DriverCard
            icon={<Radio size={18} />}
            id="AWS-01/VIS"
            label="VISIBILITY"
            value={`${station.visibility} km`}
            change={isBharati ? "Reduced" : "Acceptable"}
          />
        </div>
      </section>

      {/* ANALYSIS */}

      <section className="ops-analysis-grid">
        <div className="ops-panel">
          <div className="ops-panel-header">
            <div>
              <span>FORECAST CONTRIBUTION</span>
              <h3>Primary Demand Drivers</h3>
            </div>

            <Cpu size={20} />
          </div>

          <Contribution
            label="HVAC heating demand"
            value={isBharati ? 18 : 12}
          />

          <Contribution
            label="Wind exposure"
            value={isBharati ? 11 : 6}
          />

          <Contribution
            label="Laboratory electrical load"
            value={7}
          />

          <Contribution
            label="Water & utility systems"
            value={4}
          />

          <div className="ops-note">
            Contributions represent simulated model influence relative to the
            station baseline.
          </div>
        </div>

        <div className="ops-panel">
          <div className="ops-panel-header">
            <div>
              <span>ANOMALY MONITOR / AM-02</span>
              <h3>Equipment Condition</h3>
            </div>

            <Activity size={20} />
          </div>

          <EquipmentRow
            id="DG-01"
            name="Primary generator"
            value="NORMAL"
            state="normal"
          />

          <EquipmentRow
            id="DG-02"
            name="Secondary generator"
            value={isBharati ? "WATCH" : "NORMAL"}
            state={isBharati ? "warning" : "normal"}
          />

          <EquipmentRow
            id="HVAC-03"
            name="Heating circulation"
            value="NORMAL"
            state="normal"
          />

          <EquipmentRow
            id="SATCOM-01"
            name="Satellite communications"
            value="NORMAL"
            state="normal"
          />

          <EquipmentRow
            id="WTR-02"
            name="Water processing"
            value="NORMAL"
            state="normal"
          />
        </div>
      </section>

      {/* ADVISORY */}

      <section className="ops-section">
        <div className="ops-section-title">
          <div>
            <span>OPERATOR DECISION SUPPORT</span>
            <h2>Operational Advisory</h2>
          </div>

          <Wrench size={22} />
        </div>

        <div
          className={`ops-advisory ${
            isBharati ? "ops-advisory-warning" : ""
          }`}
        >
          <div className="ops-advisory-icon">
            {isBharati ? (
              <AlertTriangle size={23} />
            ) : (
              <CheckCircle2 size={23} />
            )}
          </div>

          <div className="ops-advisory-main">
            <div className="ops-advisory-top">
              <span>
                {isBharati ? "MAINTENANCE WATCH" : "SYSTEM STATUS"}
              </span>

              <strong>
                {isBharati ? "PRIORITY P2" : "NO ACTIVE WATCH"}
              </strong>
            </div>

            <h3>
              {isBharati
                ? "DG-02 vibration trend above simulated 7-day baseline"
                : "No significant equipment anomalies detected"}
            </h3>

            <p>
              {isBharati
                ? "Review secondary generator vibration and bearing-temperature telemetry. A preventive inspection is recommended during the next modeled low-demand window."
                : "Equipment signals remain within modeled operating envelopes. Continue scheduled telemetry review and preventive maintenance."}
            </p>

            {isBharati && (
              <div className="ops-advisory-details">
                <DataRow
                  label="Recommended window"
                  value="02:00–04:00 IST"
                />

                <DataRow
                  label="Affected asset"
                  value="DG-02"
                />

                <DataRow
                  label="Evidence"
                  value="+14% baseline deviation"
                />

                <DataRow
                  label="Confidence"
                  value="91%"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FORECAST TABLE */}

      <section className="ops-section">
        <div className="ops-section-title">
          <div>
            <span>ENGINEERING DATA</span>
            <h2>Forecast Schedule</h2>
          </div>

          <Server size={22} />
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>TIME</th>
                <th>FORECAST</th>
                <th>LOWER BOUND</th>
                <th>UPPER BOUND</th>
                <th>STATE</th>
              </tr>
            </thead>

            <tbody>
              {station.forecast
                .filter((_, index) => index % 2 === 0)
                .map((point) => (
                  <tr key={point.time}>
                    <td>{point.time}</td>
                    <td>{point.forecast} kW</td>
                    <td>{point.low} kW</td>
                    <td>{point.high} kW</td>
                    <td>
                      <span
                        className={
                          point.forecast >= station.demandPeak - 5
                            ? "table-watch"
                            : "table-normal"
                        }
                      >
                        {point.forecast >= station.demandPeak - 5
                          ? "HIGH LOAD"
                          : "NOMINAL"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="ops-footer">
        <span>POLARIS / ANTARCTIC DIGITAL TWIN</span>

        <span>SIH26060 / SMART AUTOMATION</span>

        <span>SIMULATED OPERATIONAL TELEMETRY</span>
      </footer>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function MetricCard({
  icon,
  source,
  label,
  value,
  detail,
  status,
}: {
  icon: React.ReactNode;
  source: string;
  label: string;
  value: string;
  detail: string;
  status: "NOMINAL" | "WATCH";
}) {
  return (
    <article className="ops-metric">
      <div className="ops-metric-top">
        <div className="ops-metric-icon">{icon}</div>

        <span className={status === "WATCH" ? "watch" : "nominal"}>
          {status}
        </span>
      </div>

      <small>{source}</small>

      <span className="ops-metric-label">{label}</span>

      <strong>{value}</strong>

      <p>{detail}</p>
    </article>
  );
}

function DriverCard({
  icon,
  id,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  id: string;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <article className="ops-driver">
      <div className="ops-driver-icon">{icon}</div>

      <div>
        <small>{id}</small>

        <span>{label}</span>

        <strong>{value}</strong>

        <p>{change}</p>
      </div>
    </article>
  );
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="ops-data-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Contribution({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="ops-contribution">
      <div>
        <span>{label}</span>
        <strong>+{value}%</strong>
      </div>

      <div className="ops-contribution-track">
        <i style={{ width: `${Math.min(value * 4, 100)}%` }} />
      </div>
    </div>
  );
}

function EquipmentRow({
  id,
  name,
  value,
  state,
}: {
  id: string;
  name: string;
  value: string;
  state: "normal" | "warning";
}) {
  return (
    <div className="ops-equipment-row">
      <div>
        <span>{id}</span>
        <strong>{name}</strong>
      </div>

      <span className={`equipment-state ${state}`}>
        <i />
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   SVG FORECAST CHART
========================================================= */

function ForecastChart({
  data,
  peak,
}: {
  data: ForecastPoint[];
  peak: number;
}) {
  const width = 900;
  const height = 330;

  const paddingLeft = 58;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 48;

  const values = data.flatMap((point) => [
    point.low,
    point.high,
    point.forecast,
    point.actual ?? point.forecast,
  ]);

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);

  const min = Math.floor((rawMin - 20) / 20) * 20;
  const max = Math.ceil((rawMax + 20) / 20) * 20;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const x = (index: number) =>
    paddingLeft + (index / (data.length - 1)) * plotWidth;

  const y = (value: number) =>
    paddingTop + ((max - value) / (max - min)) * plotHeight;

  const forecastPoints = data
    .map((point, index) => `${x(index)},${y(point.forecast)}`)
    .join(" ");

  const actualData = data
    .map((point, index) => ({
      index,
      value: point.actual,
    }))
    .filter(
      (
        point
      ): point is {
        index: number;
        value: number;
      } => point.value !== undefined
    );

  const actualPoints = actualData
    .map((point) => `${x(point.index)},${y(point.value)}`)
    .join(" ");

  const upper = data.map((point, index) => [
    x(index),
    y(point.high),
  ]);

  const lower = [...data]
    .reverse()
    .map((point, reverseIndex) => {
      const index = data.length - 1 - reverseIndex;

      return [x(index), y(point.low)];
    });

  const bandPoints = [...upper, ...lower]
    .map(([px, py]) => `${px},${py}`)
    .join(" ");

  const gridValues = Array.from(
    { length: 5 },
    (_, index) => min + ((max - min) / 4) * index
  ).reverse();

  return (
    <div className="ops-svg-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="72-hour station electrical demand forecast"
      >
        {gridValues.map((value) => (
          <g key={value}>
            <line
              x1={paddingLeft}
              x2={width - paddingRight}
              y1={y(value)}
              y2={y(value)}
              className="chart-grid-line"
            />

            <text
              x={paddingLeft - 12}
              y={y(value) + 4}
              textAnchor="end"
              className="chart-axis-text"
            >
              {Math.round(value)}
            </text>
          </g>
        ))}

        <polygon
          points={bandPoints}
          className="chart-confidence-band"
        />

        <polyline
          points={forecastPoints}
          className="chart-forecast-line"
        />

        {actualPoints && (
          <polyline
            points={actualPoints}
            className="chart-actual-line"
          />
        )}

        {data.map((point, index) => (
          <g key={point.time}>
            <circle
              cx={x(index)}
              cy={y(point.forecast)}
              r="4"
              className="chart-forecast-point"
            />

            {(index % 2 === 0 || index === data.length - 1) && (
              <text
                x={x(index)}
                y={height - 18}
                textAnchor="middle"
                className="chart-axis-text"
              >
                {point.time}
              </text>
            )}
          </g>
        ))}

        <line
          x1={paddingLeft}
          x2={width - paddingRight}
          y1={y(peak)}
          y2={y(peak)}
          className="chart-peak-line"
        />

        <text
          x={width - paddingRight}
          y={y(peak) - 8}
          textAnchor="end"
          className="chart-peak-label"
        >
          PEAK {peak} kW
        </text>
      </svg>
    </div>
  );
}