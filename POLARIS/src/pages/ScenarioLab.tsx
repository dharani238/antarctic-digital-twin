import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CloudSnow,
  Cpu,
  Fuel,
  Gauge,
  Play,
  RefreshCcw,
  Server,
  ShieldCheck,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";

import { useStation } from "../context/StationContext";
import "./ScenarioLab.css";

type GeneratorMode = "automatic" | "generator-1" | "generator-2";

type ScenarioResults = {
  demand: number;
  fuelDays: number;
  thermalLoad: number;
  risk: number;
  reliability: number;
  weatherRisk: number;
};

export default function ScenarioLab() {
  const { stationId, setStationId } = useStation();

  const [temperature, setTemperature] = useState(0);
  const [wind, setWind] = useState(0);
  const [demand, setDemand] = useState(0);
  const [fuelReduction, setFuelReduction] = useState(0);
  const [generatorMode, setGeneratorMode] =
    useState<GeneratorMode>("automatic");

  const [lastRun, setLastRun] = useState<Date | null>(null);

  const baseline = useMemo(() => {
    if (stationId === "maitri") {
      return {
        temperature: -16.8,
        wind: 31,
        demand: 318,
        fuelDays: 96,
        reliability: 96.8,
      };
    }

    return {
      temperature: -21.4,
      wind: 46,
      demand: 356,
      fuelDays: 84,
      reliability: 97.4,
    };
  }, [stationId]);

  const results: ScenarioResults = useMemo(() => {
    const coldPenalty = Math.max(0, -temperature) * 2.4;
    const windPenalty = wind * 0.13;
    const demandIncrease = baseline.demand * (demand / 100);

    const generatorPenalty =
      generatorMode === "generator-1"
        ? 10
        : generatorMode === "generator-2"
        ? 6
        : 0;

    const projectedDemand =
      baseline.demand +
      demandIncrease +
      coldPenalty +
      windPenalty +
      generatorPenalty;

    const consumptionFactor = Math.max(
      0.65,
      projectedDemand / baseline.demand
    );

    const remainingFuel =
      baseline.fuelDays *
      (1 - fuelReduction / 100) /
      consumptionFactor;

    const thermalLoad = Math.min(
      100,
      42 +
        Math.max(0, -temperature) * 2.2 +
        demand * 0.42 +
        wind * 0.1
    );

    const weatherRisk = Math.min(
      100,
      18 +
        Math.max(0, -temperature) * 1.45 +
        wind * 0.65
    );

    const risk = Math.min(
      100,
      12 +
        Math.max(0, -temperature) * 1.1 +
        wind * 0.42 +
        demand * 0.5 +
        fuelReduction * 0.52 +
        generatorPenalty * 0.7
    );

    const reliability = Math.max(
      55,
      baseline.reliability - risk * 0.19
    );

    return {
      demand: Math.round(projectedDemand),
      fuelDays: Math.max(0, Math.round(remainingFuel)),
      thermalLoad: Math.round(thermalLoad),
      risk: Math.round(risk),
      reliability: Number(reliability.toFixed(1)),
      weatherRisk: Math.round(weatherRisk),
    };
  }, [
    baseline,
    temperature,
    wind,
    demand,
    fuelReduction,
    generatorMode,
  ]);

  const riskLevel =
    results.risk >= 70
      ? "CRITICAL"
      : results.risk >= 40
      ? "WATCH"
      : "NOMINAL";

  const riskClass =
    riskLevel === "CRITICAL"
      ? "critical"
      : riskLevel === "WATCH"
      ? "watch"
      : "nominal";

  const resetScenario = () => {
    setTemperature(0);
    setWind(0);
    setDemand(0);
    setFuelReduction(0);
    setGeneratorMode("automatic");
    setLastRun(null);
  };

  const runScenario = () => {
    setLastRun(new Date());
  };

  const sliderBackground = (
    value: number,
    min: number,
    max: number
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return {
      background: `linear-gradient(
        to right,
        #238da3 0%,
        #238da3 ${percentage}%,
        #dce6e8 ${percentage}%,
        #dce6e8 100%
      )`,
    };
  };

  return (
    <main className="scenario-page">
      {/* HEADER */}

      <header className="scenario-header">
        <div>
          <span className="scenario-breadcrumb">
            POLARIS / DECISION SUPPORT / SCENARIO LAB
          </span>

          <h1>Operational Scenario Lab</h1>

          <p>
            Engineering what-if simulation for Antarctic station
            operations. Modify environmental, energy and logistics
            parameters to estimate their potential effect on station
            resilience.
          </p>
        </div>

        <div className="scenario-station">
          <span>ACTIVE STATION</span>

          <div>
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
      </header>

      {/* SYSTEM STATUS */}

      <section className="scenario-statusbar">
        <div>
          <span className="scenario-online-dot" />

          <strong>SIMULATION ENGINE READY</strong>

          <span>ISOLATED FROM OPERATIONAL CONTROL</span>
        </div>

        <div className="scenario-status-meta">
          <span>
            STATION
            <strong>{stationId.toUpperCase()}</strong>
          </span>

          <span>
            MODEL
            <strong>POLARIS-SIM 1.0</strong>
          </span>

          <span>
            MODE
            <strong>DECISION SUPPORT</strong>
          </span>
        </div>
      </section>

      {/* NOTICE */}

      <section className="scenario-notice">
        <AlertTriangle size={16} />

        <strong>PROTOTYPE SIMULATION</strong>

        <span>
          Results are generated from simulated prototype telemetry and
          simplified engineering assumptions. They are not live NCPOR
          operational forecasts.
        </span>
      </section>

      {/* WORKSPACE */}

      <section className="scenario-workspace">
        {/* LEFT PANEL */}

        <div className="scenario-panel">
          <div className="scenario-panel-header">
            <div>
              <span>SCENARIO CONFIGURATION</span>
              <h2>Simulation Inputs</h2>
            </div>

            <Cpu size={19} />
          </div>

          {/* TEMPERATURE */}

          <ScenarioControl
            icon={<Thermometer size={17} />}
            id="ENV-01"
            title="External temperature change"
            value={`${temperature > 0 ? "+" : ""}${temperature} °C`}
            min={-20}
            max={5}
            sliderValue={temperature}
            onChange={setTemperature}
            labels={["-20°C", "BASELINE", "+5°C"]}
            style={sliderBackground(temperature, -20, 5)}
          />

          {/* WIND */}

          <ScenarioControl
            icon={<Wind size={17} />}
            id="ENV-02"
            title="Wind speed increase"
            value={`+${wind} km/h`}
            min={0}
            max={80}
            sliderValue={wind}
            onChange={setWind}
            labels={["0", "40", "80 km/h"]}
            style={sliderBackground(wind, 0, 80)}
          />

          {/* DEMAND */}

          <ScenarioControl
            icon={<Zap size={17} />}
            id="ENE-01"
            title="Electrical demand increase"
            value={`+${demand} %`}
            min={0}
            max={50}
            sliderValue={demand}
            onChange={setDemand}
            labels={["0%", "25%", "50%"]}
            style={sliderBackground(demand, 0, 50)}
          />

          {/* FUEL */}

          <ScenarioControl
            icon={<Fuel size={17} />}
            id="LOG-01"
            title="Available fuel reduction"
            value={`-${fuelReduction} %`}
            min={0}
            max={60}
            sliderValue={fuelReduction}
            onChange={setFuelReduction}
            labels={["0%", "30%", "60%"]}
            style={sliderBackground(fuelReduction, 0, 60)}
          />

          {/* GENERATOR */}

          <div className="scenario-generator-control">
            <div className="scenario-control-title">
              <div className="scenario-control-icon">
                <Server size={17} />
              </div>

              <div>
                <small>ENE-02</small>
                <strong>Power generation configuration</strong>
              </div>
            </div>

            <select
              value={generatorMode}
              onChange={(event) =>
                setGeneratorMode(
                  event.target.value as GeneratorMode
                )
              }
            >
              <option value="automatic">
                Automatic load balancing
              </option>

              <option value="generator-1">
                Generator 1 unavailable
              </option>

              <option value="generator-2">
                Generator 2 unavailable
              </option>
            </select>
          </div>

          <div className="scenario-actions">
            <button
              className="scenario-reset"
              onClick={resetScenario}
            >
              <RefreshCcw size={14} />
              RESET INPUTS
            </button>

            <button
              className="scenario-run"
              onClick={runScenario}
            >
              <Play size={14} />
              RUN SIMULATION
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="scenario-panel scenario-preview">
          <div className="scenario-panel-header">
            <div>
              <span>MODEL OUTPUT</span>
              <h2>Projected Station State</h2>
            </div>

            <Gauge size={19} />
          </div>

          <div className="scenario-preview-state">
            <div>
              <span>OPERATIONAL RISK</span>

              <div
                className={`scenario-risk-indicator ${riskClass}`}
              >
                <strong>{riskLevel}</strong>
              </div>
            </div>

            <div>
              <span>RISK INDEX</span>
              <strong>{results.risk}/100</strong>
            </div>
          </div>

          <div className="scenario-preview-grid">
            <PreviewMetric
              label="PROJECTED DEMAND"
              value={`${results.demand} kW`}
              note={`Baseline ${baseline.demand} kW`}
            />

            <PreviewMetric
              label="FUEL ENDURANCE"
              value={`${results.fuelDays} days`}
              note={`Baseline ${baseline.fuelDays} days`}
            />

            <PreviewMetric
              label="THERMAL LOAD"
              value={`${results.thermalLoad}%`}
              note="Estimated heating-system load"
            />

            <PreviewMetric
              label="SYSTEM RELIABILITY"
              value={`${results.reliability}%`}
              note="Scenario-derived estimate"
            />
          </div>

          <div className="scenario-risk-scale">
            <div className="scenario-scale-labels">
              <span>NOMINAL</span>
              <span>WATCH</span>
              <span>ELEVATED</span>
              <span>CRITICAL</span>
            </div>

            <div className="scenario-scale-track">
              <div
                className="scenario-scale-marker"
                style={{
                  left: `${Math.min(
                    98,
                    Math.max(2, results.risk)
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="scenario-preview-note">
            Preview values update continuously while parameters are
            adjusted. RUN SIMULATION records the current scenario as
            the latest engineering assessment.
          </div>
        </div>
      </section>

      {/* COMPARISON */}

      <section className="scenario-section">
        <div className="scenario-section-heading">
          <div>
            <span>ENGINEERING COMPARISON</span>
            <h2>Baseline vs Scenario</h2>
          </div>

          <ArrowRight size={20} />
        </div>

        <div className="scenario-comparison">
          <ComparisonCard
            icon={<Zap size={17} />}
            title="Electrical Demand"
            baseline={`${baseline.demand} kW`}
            scenario={`${results.demand} kW`}
            delta={`${results.demand - baseline.demand >= 0 ? "+" : ""}${
              results.demand - baseline.demand
            } kW`}
            warning={results.demand > baseline.demand * 1.2}
          />

          <ComparisonCard
            icon={<Fuel size={17} />}
            title="Fuel Endurance"
            baseline={`${baseline.fuelDays} days`}
            scenario={`${results.fuelDays} days`}
            delta={`${results.fuelDays - baseline.fuelDays} days`}
            warning={results.fuelDays < baseline.fuelDays * 0.7}
          />

          <ComparisonCard
            icon={<CloudSnow size={17} />}
            title="Weather Exposure"
            baseline="18 / 100"
            scenario={`${results.weatherRisk} / 100`}
            delta={`+${Math.max(0, results.weatherRisk - 18)} points`}
            warning={results.weatherRisk >= 40}
          />

          <ComparisonCard
            icon={<ShieldCheck size={17} />}
            title="System Reliability"
            baseline={`${baseline.reliability}%`}
            scenario={`${results.reliability}%`}
            delta={`${(
              results.reliability - baseline.reliability
            ).toFixed(1)}%`}
            warning={results.reliability < 90}
          />
        </div>
      </section>

      {/* IMPACT ASSESSMENT */}

      <section className="scenario-section">
        <div className="scenario-section-heading">
          <div>
            <span>SYSTEM ASSESSMENT</span>
            <h2>Operational Impact Matrix</h2>
          </div>

          <Server size={20} />
        </div>

        <div className="scenario-impact-grid">
          <ImpactRow
            id="SYS-PWR"
            system="Power Generation"
            description="Electrical production and generator reserve"
            warning={results.demand > baseline.demand * 1.2}
          />

          <ImpactRow
            id="SYS-THM"
            system="Thermal Control"
            description="Heating demand and thermal-management load"
            warning={results.thermalLoad >= 70}
          />

          <ImpactRow
            id="SYS-FUL"
            system="Fuel Reserve"
            description="Projected station fuel endurance"
            warning={results.fuelDays < 60}
          />

          <ImpactRow
            id="SYS-ENV"
            system="Environmental Exposure"
            description="Wind and temperature-related operating pressure"
            warning={results.weatherRisk >= 45}
          />

          <ImpactRow
            id="SYS-OPS"
            system="Station Operations"
            description="Combined resilience and operational continuity"
            warning={results.risk >= 40}
          />
        </div>
      </section>

      {/* ADVISORY */}

      <section className="scenario-section">
        <div className="scenario-section-heading">
          <div>
            <span>DECISION SUPPORT</span>
            <h2>Engineering Advisory</h2>
          </div>

          <ShieldCheck size={20} />
        </div>

        <div className={`scenario-advisory ${riskClass}`}>
          <div className="scenario-advisory-icon">
            {riskLevel === "NOMINAL" ? (
              <ShieldCheck size={21} />
            ) : (
              <AlertTriangle size={21} />
            )}
          </div>

          <div>
            <span>SCENARIO ASSESSMENT</span>

            <h3>
              {riskLevel === "NOMINAL"
                ? "Station resilience remains within nominal limits"
                : riskLevel === "WATCH"
                ? "Operational margins require monitoring"
                : "Scenario produces significant operational pressure"}
            </h3>

            <p>
              {riskLevel === "NOMINAL"
                ? "The simulated configuration does not indicate a major reduction in station operating margins. Continue routine monitoring of power, environmental and logistics telemetry."
                : riskLevel === "WATCH"
                ? "The simulated configuration reduces operating margins. Review generator loading, fuel endurance and environmental exposure before applying comparable operational changes."
                : "The simulated configuration substantially reduces projected station resilience. Evaluate load reduction, reserve generation and logistics contingency measures before considering this operating state."}
            </p>
          </div>

          <div className="scenario-advisory-state">
            <small>MODEL CLASSIFICATION</small>
            <strong>{riskLevel}</strong>
          </div>
        </div>
      </section>

      {/* RUN INFO */}

      <section className="scenario-run-info">
        <div>
          <span>STATION</span>
          <strong>{stationId.toUpperCase()}</strong>
        </div>

        <div>
          <span>SIMULATION MODEL</span>
          <strong>POLARIS-SIM 1.0</strong>
        </div>

        <div>
          <span>RISK INDEX</span>
          <strong>{results.risk}/100</strong>
        </div>

        <div>
          <span>GENERATOR MODE</span>
          <strong>{generatorMode.toUpperCase()}</strong>
        </div>

        <div>
          <span>LAST RUN</span>
          <strong>
            {lastRun
              ? lastRun.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "NOT EXECUTED"}
          </strong>
        </div>
      </section>

      <footer className="scenario-footer">
        <span>
          POLARIS ANTARCTIC DIGITAL TWIN · SIH26060
        </span>

        <span>
          PROTOTYPE DECISION-SUPPORT ENVIRONMENT
        </span>
      </footer>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

interface ScenarioControlProps {
  icon: React.ReactNode;
  id: string;
  title: string;
  value: string;
  min: number;
  max: number;
  sliderValue: number;
  onChange: (value: number) => void;
  labels: string[];
  style: React.CSSProperties;
}

function ScenarioControl({
  icon,
  id,
  title,
  value,
  min,
  max,
  sliderValue,
  onChange,
  labels,
  style,
}: ScenarioControlProps) {
  return (
    <div className="scenario-control">
      <div className="scenario-control-top">
        <div className="scenario-control-title">
          <div className="scenario-control-icon">{icon}</div>

          <div>
            <small>{id}</small>
            <strong>{title}</strong>
          </div>
        </div>

        <div className="scenario-control-value">{value}</div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={sliderValue}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        style={style}
      />

      <div className="scenario-range-labels">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function PreviewMetric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="scenario-preview-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function ComparisonCard({
  icon,
  title,
  baseline,
  scenario,
  delta,
  warning,
}: {
  icon: React.ReactNode;
  title: string;
  baseline: string;
  scenario: string;
  delta: string;
  warning: boolean;
}) {
  return (
    <article className="scenario-comparison-card">
      <div className="scenario-comparison-header">
        <div>{icon}</div>

        <span
          className={
            warning ? "comparison-watch" : "comparison-normal"
          }
        >
          {warning ? "WATCH" : "NORMAL"}
        </span>
      </div>

      <h3>{title}</h3>

      <div className="scenario-comparison-values">
        <div>
          <span>BASELINE</span>
          <strong>{baseline}</strong>
        </div>

        <div className="scenario-arrow">→</div>

        <div>
          <span>SCENARIO</span>
          <strong>{scenario}</strong>
        </div>
      </div>

      <div
        className={`scenario-delta ${
          warning ? "warning" : ""
        }`}
      >
        Δ {delta}
      </div>
    </article>
  );
}

function ImpactRow({
  id,
  system,
  description,
  warning,
}: {
  id: string;
  system: string;
  description: string;
  warning: boolean;
}) {
  return (
    <div className="scenario-impact-row">
      <div className="scenario-impact-id">
        <span>{id}</span>
      </div>

      <div className="scenario-impact-system">
        <strong>{system}</strong>
        <span>{description}</span>
      </div>

      <div
        className={`scenario-impact-status ${
          warning ? "warning" : "normal"
        }`}
      >
        <i />
        {warning ? "REVIEW" : "NORMAL"}
      </div>
    </div>
  );
}