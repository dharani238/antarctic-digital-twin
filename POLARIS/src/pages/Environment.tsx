import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CloudSnow,
  Compass,
  Droplets,
  Eye,
  Gauge,
  ShieldCheck,
  Snowflake,
  Thermometer,
  Wind,
} from "lucide-react";

import { useStation } from "../context/StationContext";
import { stations } from "../data/stations";
import "./Environment.css";

export default function Environment() {
  const { stationId, setStationId } = useStation();

  const station = stations[stationId];

  const heroVideo = "/videos/snowstorm.mp4";
  const blizzardWide = "/images/environment/blizzard-wide.jpg";
  const blizzardImage = "/images/environment/blizzard.jpg";
  const iceAerial = "/images/environment/ice-aerial.jpg";

  const riskLevel =
    station.environment.windSpeed >= 45 ? "ELEVATED" : "NORMAL";

  const visibilityStatus =
    station.environment.visibility < 6 ? "REDUCED" : "GOOD";

  return (
    <div className="env-page">
      {/* ================= HEADER ================= */}

      <section className="env-heading">
        <div>
          <span className="env-eyebrow">
            POLARIS / ENVIRONMENTAL INTELLIGENCE
          </span>

          <h1>Antarctic Environment</h1>

          <p>
            Environmental monitoring, extreme-weather awareness and
            predictive intelligence for India's Antarctic research stations.
          </p>
        </div>

        <div className="env-station-control">
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
      </section>

      {/* ================= DATA NOTICE ================= */}

      <section className="env-data-notice">
        <ShieldCheck size={19} />

        <strong>PROTOTYPE DATA POLICY</strong>

        <span>
          Station identity and geographic information use public references.
          Environmental telemetry shown below is simulated for Digital Twin
          demonstration.
        </span>
      </section>

      {/* ================= VIDEO HERO ================= */}

      <section className="env-hero">
        <video
          className="env-hero-video"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={blizzardWide}
        />

        <div className="env-hero-overlay" />

        <div className="env-hero-content">
          <div className="env-live">
            <span />
            ENVIRONMENT SIMULATION ACTIVE
          </div>

          <div className="env-hero-icon">
            <CloudSnow size={35} />
          </div>

          <span className="env-eyebrow">
            ANTARCTIC WEATHER NETWORK
          </span>

          <h2>{station.name} Polar Conditions</h2>

          <p>
            Continuous simulation of atmospheric conditions surrounding the{" "}
            {station.name} Research Station.
          </p>

          <div className="env-hero-reading">
            <div>
              <span>TEMPERATURE</span>
              <strong>{station.environment.temperature}°C</strong>
            </div>

            <div>
              <span>FEELS LIKE</span>
              <strong>{station.environment.feelsLike}°C</strong>
            </div>

            <div>
              <span>CONDITION</span>
              <strong>{station.environment.condition}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ================= METRICS ================= */}

      <section className="env-metrics">
        <div className="env-metric-card">
          <div className="env-metric-icon">
            <Thermometer size={23} />
          </div>

          <span>EXTERNAL TEMPERATURE</span>

          <strong>{station.environment.temperature}°C</strong>

          <p>
            Feels like {station.environment.feelsLike}°C
          </p>
        </div>

        <div className="env-metric-card">
          <div className="env-metric-icon">
            <Wind size={23} />
          </div>

          <span>WIND SPEED</span>

          <strong>{station.environment.windSpeed} km/h</strong>

          <p>{station.environment.windDirection} direction</p>
        </div>

        <div className="env-metric-card">
          <div className="env-metric-icon">
            <Gauge size={23} />
          </div>

          <span>PRESSURE</span>

          <strong>{station.environment.pressure} hPa</strong>

          <p>Simulated atmospheric pressure</p>
        </div>

        <div className="env-metric-card">
          <div className="env-metric-icon">
            <Droplets size={23} />
          </div>

          <span>HUMIDITY</span>

          <strong>{station.environment.humidity}%</strong>

          <p>Relative humidity</p>
        </div>

        <div className="env-metric-card">
          <div className="env-metric-icon">
            <Eye size={23} />
          </div>

          <span>VISIBILITY</span>

          <strong>{station.environment.visibility} km</strong>

          <p>{visibilityStatus}</p>
        </div>
      </section>

      {/* ================= VISUAL INTELLIGENCE ================= */}

      <section className="env-section-title">
        <div>
          <span className="env-eyebrow">
            VISUAL INTELLIGENCE
          </span>

          <h2>Environmental Observation Network</h2>
        </div>

        <Snowflake size={28} />
      </section>

      <section className="env-visual-grid">
        {/* BLIZZARD */}

        <article
          className="env-visual-card env-large-card"
          style={{
            backgroundImage: `linear-gradient(
              180deg,
              rgba(2, 28, 39, 0.08),
              rgba(2, 28, 39, 0.92)
            ), url("${blizzardWide}")`,
          }}
        >
          <div className="env-image-content">
            <div className="env-image-icon">
              <Wind size={25} />
            </div>

            <span>EXTREME WEATHER</span>

            <h3>Blizzard Monitoring</h3>

            <p>
              Visual reference for extreme Antarctic wind and snow
              conditions used in the environmental simulation.
            </p>

            <div className="env-image-status">
              <span />
              WEATHER MODEL ACTIVE
            </div>
          </div>
        </article>

        {/* ICE */}

        <article
          className="env-visual-card"
          style={{
            backgroundImage: `linear-gradient(
              180deg,
              rgba(2, 28, 39, 0.05),
              rgba(2, 28, 39, 0.9)
            ), url("${iceAerial}")`,
          }}
        >
          <div className="env-image-content">
            <div className="env-image-icon">
              <Snowflake size={25} />
            </div>

            <span>SURFACE OBSERVATION</span>

            <h3>Ice Environment</h3>

            <p>
              Antarctic terrain imagery supporting remote environmental
              situational awareness.
            </p>
          </div>
        </article>

        {/* SNOW */}

        <article
          className="env-visual-card"
          style={{
            backgroundImage: `linear-gradient(
              180deg,
              rgba(2, 28, 39, 0.05),
              rgba(2, 28, 39, 0.9)
            ), url("${blizzardImage}")`,
          }}
        >
          <div className="env-image-content">
            <div className="env-image-icon">
              <CloudSnow size={25} />
            </div>

            <span>WEATHER OBSERVATION</span>

            <h3>Snow Conditions</h3>

            <p>
              Environmental reference imagery for low-visibility and
              snow-event simulation.
            </p>
          </div>
        </article>
      </section>

      {/* ================= ENVIRONMENT STATUS ================= */}

      <section className="env-dashboard-grid">
        <div className="env-panel">
          <div className="env-panel-header">
            <div>
              <span className="env-eyebrow">
                ATMOSPHERIC STATUS
              </span>

              <h3>Current Environment</h3>
            </div>

            <Compass size={25} />
          </div>

          <div className="env-status-list">
            <div>
              <span>Temperature</span>

              <strong>
                {station.environment.temperature}°C
              </strong>
            </div>

            <div>
              <span>Feels Like</span>

              <strong>
                {station.environment.feelsLike}°C
              </strong>
            </div>

            <div>
              <span>Wind</span>

              <strong>
                {station.environment.windSpeed} km/h{" "}
                {station.environment.windDirection}
              </strong>
            </div>

            <div>
              <span>Pressure</span>

              <strong>
                {station.environment.pressure} hPa
              </strong>
            </div>

            <div>
              <span>Humidity</span>

              <strong>
                {station.environment.humidity}%
              </strong>
            </div>

            <div>
              <span>Visibility</span>

              <strong>
                {station.environment.visibility} km
              </strong>
            </div>
          </div>
        </div>

        {/* ================= RISK PANEL ================= */}

        <div className="env-panel env-risk-panel">
          <div className="env-panel-header">
            <div>
              <span className="env-eyebrow">
                OPERATIONAL RISK
              </span>

              <h3>Weather Risk Assessment</h3>
            </div>

            <AlertTriangle size={25} />
          </div>

          <div className="env-risk-score">
            <div
              className={
                riskLevel === "ELEVATED"
                  ? "env-risk-circle elevated"
                  : "env-risk-circle"
              }
            >
              <AlertTriangle size={29} />

              <strong>{riskLevel}</strong>

              <span>RISK LEVEL</span>
            </div>

            <div className="env-risk-description">
              <span>POLARIS ASSESSMENT</span>

              <strong>
                {riskLevel === "ELEVATED"
                  ? "Environmental conditions require monitoring"
                  : "Environmental conditions remain stable"}
              </strong>

              <p>
                Assessment combines simulated wind speed, visibility,
                temperature and atmospheric conditions.
              </p>
            </div>
          </div>
        </div>

        {/* ================= AI FORECAST ================= */}

        <div className="env-panel env-ai-panel">
          <div className="env-panel-header">
            <div>
              <span className="env-eyebrow">
                POLARIS AI
              </span>

              <h3>Environmental Forecast</h3>
            </div>

            <BrainCircuit size={25} />
          </div>

          <div className="env-ai-status">
            <div className="env-ai-orb">
              <BrainCircuit size={30} />
            </div>

            <div>
              <strong>FORECAST ENGINE ACTIVE</strong>
              <span>Processing environmental telemetry</span>
            </div>
          </div>

          <div className="env-forecast-box">
            <span>NEXT OPERATING WINDOW</span>

            <strong>
              {station.environment.windSpeed >= 40
                ? "Wind exposure may remain elevated"
                : "Conditions expected to remain manageable"}
            </strong>

            <p>
              POLARIS evaluates simulated environmental telemetry to support
              planning for station operations and outdoor activity.
            </p>

            <div className="env-confidence">
              <span>SIMULATION CONFIDENCE</span>
              <strong>86%</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SAFETY ================= */}

      <section className="env-safety">
        <div className="env-safety-icon">
          <ShieldCheck size={30} />
        </div>

        <div>
          <span className="env-eyebrow">
            OPERATIONAL GUIDANCE
          </span>

          <h3>Environmental Safety Advisory</h3>

          <p>
            {riskLevel === "ELEVATED"
              ? "Elevated simulated wind conditions detected. Outdoor operations should be reviewed before deployment."
              : "Simulated environmental conditions are currently within the normal operating envelope."}
          </p>
        </div>

        <div className="env-safety-state">
          <Activity size={18} />
          MONITORING ACTIVE
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="env-footer">
        <span>
          POLARIS • Environmental Intelligence
        </span>

        <span>
          DIGITAL TWIN PROTOTYPE • SIH26060
        </span>
      </footer>
    </div>
  );
}