import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Radio,
  ShieldCheck,
  Snowflake,
} from "lucide-react";

import { login } from "../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError("Enter your registered email address.");
      return;
    }

    if (!cleanPassword) {
      setError("Enter your password.");
      return;
    }

    try {
      setLoading(true);

      /*
       * REAL BACKEND LOGIN
       *
       * api.ts sends:
       *
       * POST http://localhost:5001/api/v1/auth/login
       *
       * The backend returns the JWT.
       *
       * api.ts automatically stores:
       * polaris_token
       * polaris_user
       */

      const response = await login(
        cleanEmail,
        cleanPassword
      );

      if (!response.success) {
        setError(
          response.message ||
            "Unable to authenticate operator."
        );
        return;
      }

      if (!response.data?.token) {
        setError(
          "Authentication succeeded but no access token was returned."
        );
        return;
      }

      /*
       * Token has already been saved by api.ts.
       * Now enter the protected application.
       */

      navigate("/command", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "POLARIS authentication error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to connect to the POLARIS authentication service."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleRegister() {
    navigate("/register");
  }

  return (
    <div className="loginPage">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="loginHeader">
        <div className="loginBrand">
          <div className="loginBrandIcon">
            <Snowflake
              size={23}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <div className="loginBrandName">
              POLARIS
            </div>

            <div className="loginBrandSubtitle">
              ANTARCTIC DIGITAL TWIN
            </div>
          </div>
        </div>

        <div className="loginSystemStatus">
          <span className="loginStatusDot" />

          SIMULATION PLATFORM ONLINE
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="loginMain">
        {/* =================================================
            LEFT HERO
        ================================================= */}

        <section className="loginHero">
          <div className="loginEyebrow">
            <Radio size={15} />

            SIH26060 · REMOTE STATION OPERATIONS
          </div>

          <h1>
            Antarctic
            <br />

            Operations
            <br />

            Intelligence.
          </h1>

          <p className="loginHeroDescription">
            A Digital Twin decision-support platform
            for remote monitoring, simulation,
            predictive intelligence and operational
            analysis of India's Antarctic research
            stations.
          </p>

          <div className="loginStations">
            <div className="loginStation">
              <strong>MAITRI</strong>

              <span>
                Schirmacher Oasis
              </span>
            </div>

            <div className="loginStationDivider" />

            <div className="loginStation">
              <strong>BHARATI</strong>

              <span>
                Larsemann Hills
              </span>
            </div>
          </div>
        </section>

        {/* =================================================
            LOGIN CONSOLE
        ================================================= */}

        <section className="loginConsole">
          <div className="loginConsoleBody">
            <div className="loginAccessLabel">
              <ShieldCheck size={15} />

              OPERATOR ACCESS
            </div>

            <h2>
              Operations Console
            </h2>

            <p className="loginConsoleDescription">
              Sign in using your registered POLARIS
              operator credentials.
            </p>

            <form onSubmit={handleLogin}>
              {/* =========================================
                  EMAIL
              ========================================= */}

              <div className="loginField">
                <label htmlFor="polaris-email">
                  EMAIL ADDRESS
                </label>

                <div className="loginInputWrap">
                  <Mail
                    className="loginInputIcon"
                    size={18}
                    strokeWidth={1.7}
                  />

                  <input
                    id="polaris-email"
                    type="email"
                    placeholder="operator@example.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(
                        event.target.value
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* =========================================
                  PASSWORD
              ========================================= */}

              <div className="loginField">
                <label htmlFor="polaris-password">
                  ACCESS CREDENTIAL
                </label>

                <div className="loginInputWrap">
                  <LockKeyhole
                    className="loginInputIcon"
                    size={18}
                    strokeWidth={1.7}
                  />

                  <input
                    id="polaris-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />

                  <button
                    type="button"
                    className="loginPasswordToggle"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* =========================================
                  ERROR
              ========================================= */}

              {error && (
                <div
                  className="loginError"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* =========================================
                  LOGIN
              ========================================= */}

              <button
                className="loginSubmit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "AUTHENTICATING..."
                  : "ENTER COMMAND CENTER"}

                {!loading && (
                  <ArrowRight
                    size={18}
                  />
                )}
              </button>
            </form>

            {/* =========================================
                REGISTER
            ========================================= */}

            <div className="loginRegister">
              <span>
                New POLARIS operator?
              </span>

              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
              >
                Create operator account
              </button>
            </div>
          </div>

          {/* =================================================
              SYSTEM INFORMATION
          ================================================= */}

          <div className="loginConsoleFooter">
            <div>
              <span>SYSTEM</span>

              <strong>
                POLARIS
              </strong>
            </div>

            <div>
              <span>MISSION</span>

              <strong>
                SIH26060
              </strong>
            </div>

            <div>
              <span>MODE</span>

              <strong>
                PROTOTYPE
              </strong>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="loginFooter">
        <ShieldCheck
          size={13}
          style={{
            marginRight: "9px",
          }}
        />

        SIH PROTOTYPE · Operational telemetry
        displayed by POLARIS is simulated for
        demonstration.
      </footer>
    </div>
  );
}