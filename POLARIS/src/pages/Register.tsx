import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Snowflake,
  User,
} from "lucide-react";

import "./Register.css";

// Production backend on Render.
// If VITE_API_BASE_URL exists, it will use that instead.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://antarctic-digital-twin.onrender.com/api/v1";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("Enter the operator name.");
      return;
    }

    if (!cleanEmail) {
      setError("Enter an email address.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 4) {
      setError(
        "Password must contain at least 4 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      console.log(
        "REGISTER REQUEST:",
        `${API_BASE_URL}/auth/register`
      );

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password,
            role: "OPERATOR",
          }),
        }
      );

      let result: any = null;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      console.log(
        "REGISTER RESPONSE:",
        response.status,
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Unable to create operator account (${response.status}).`
        );
      }

      setSuccess(
        "Operator account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login", {
          state: {
            registeredEmail: cleanEmail,
          },
          replace: true,
        });
      }, 1000);
    } catch (err) {
      console.error(
        "POLARIS registration error:",
        err
      );

      if (err instanceof TypeError) {
        setError(
          "Unable to connect to the POLARIS server. Please try again."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to create operator account."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="registerPage">
      <header className="registerHeader">
        <div className="registerBrand">
          <div className="registerBrandIcon">
            <Snowflake size={22} />
          </div>

          <div>
            <div className="registerBrandName">
              POLARIS
            </div>

            <div className="registerBrandSubtitle">
              ANTARCTIC DIGITAL TWIN
            </div>
          </div>
        </div>

        <div className="registerStatus">
          <span />
          OPERATOR MANAGEMENT
        </div>
      </header>

      <main className="registerMain">
        <section className="registerInformation">
          <div className="registerEyebrow">
            <ShieldCheck size={15} />
            SIH26060 · OPERATOR ACCESS
          </div>

          <h1>
            Station
            <br />
            Operator
            <br />
            Registration.
          </h1>

          <p>
            Create an operator profile for access to
            the POLARIS Antarctic Digital Twin command
            environment.
          </p>

          <div className="registerInfoBox">
            <ShieldCheck size={22} />

            <div>
              <strong>
                Controlled Operations Environment
              </strong>

              <span>
                Access environmental telemetry,
                infrastructure status, simulations and
                predictive operational intelligence.
              </span>
            </div>
          </div>
        </section>

        <section className="registerConsole">
          <div className="registerConsoleBody">
            <button
              className="registerBack"
              type="button"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft size={16} />
              BACK TO LOGIN
            </button>

            <div className="registerAccessLabel">
              <ShieldCheck size={15} />
              NEW OPERATOR
            </div>

            <h2>Create Operator Account</h2>

            <p className="registerDescription">
              Register credentials for the POLARIS
              operations environment.
            </p>

            <form onSubmit={handleRegister}>
              <div className="registerField">
                <label htmlFor="operator-name">
                  OPERATOR NAME
                </label>

                <div className="registerInputWrap">
                  <User size={18} />

                  <input
                    id="operator-name"
                    type="text"
                    placeholder="Operator name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="registerField">
                <label htmlFor="operator-email">
                  EMAIL ADDRESS
                </label>

                <div className="registerInputWrap">
                  <Mail size={18} />

                  <input
                    id="operator-email"
                    type="email"
                    placeholder="operator@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="registerField">
                <label htmlFor="operator-password">
                  ACCESS CREDENTIAL
                </label>

                <div className="registerInputWrap">
                  <LockKeyhole size={18} />

                  <input
                    id="operator-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
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

              <div className="registerField">
                <label htmlFor="confirm-password">
                  CONFIRM CREDENTIAL
                </label>

                <div className="registerInputWrap">
                  <LockKeyhole size={18} />

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="registerError">
                  {error}
                </div>
              )}

              {success && (
                <div className="registerSuccess">
                  {success}
                </div>
              )}

              <button
                className="registerSubmit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "CREATING ACCOUNT..."
                  : "CREATE OPERATOR ACCOUNT"}

                {!loading && (
                  <ArrowRight size={18} />
                )}
              </button>
            </form>
          </div>

          <div className="registerConsoleFooter">
            <div>
              <span>SYSTEM</span>
              <strong>POLARIS</strong>
            </div>

            <div>
              <span>MISSION</span>
              <strong>SIH26060</strong>
            </div>

            <div>
              <span>ACCESS</span>
              <strong>OPERATOR</strong>
            </div>
          </div>
        </section>
      </main>

      <footer className="registerFooter">
        SIH PROTOTYPE · POLARIS Antarctic Digital Twin
      </footer>
    </div>
  );
}