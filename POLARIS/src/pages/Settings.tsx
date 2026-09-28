import {
  Bell,
  CheckCircle2,
  Database,
  Globe2,
  LockKeyhole,
  Monitor,
  Save,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from "lucide-react";

import { useState } from "react";
import { useStation } from "../context/StationContext";

export default function Settings() {
  const { stationId, setStationId } = useStation();

  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [saved, setSaved] = useState(false);

  const user = (() => {
    try {
      const stored = localStorage.getItem("polaris_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="settings-page">
      <style>
        {`
          .settings-page {
            min-height: 100%;
            padding: 34px 38px 50px;
            background:
              radial-gradient(
                circle at 80% 0%,
                rgba(20, 150, 170, 0.08),
                transparent 32%
              ),
              #031820;
            color: #e8f8fb;
          }

          .settings-header {
            margin-bottom: 30px;
          }

          .settings-eyebrow {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #35d8e9;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .18em;
            margin-bottom: 10px;
          }

          .settings-header h1 {
            margin: 0;
            font-size: 34px;
            font-weight: 600;
            letter-spacing: -.035em;
          }

          .settings-header p {
            margin: 8px 0 0;
            color: #789ca5;
            font-size: 13px;
          }

          .settings-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 320px;
            gap: 22px;
            max-width: 1180px;
          }

          .settings-main {
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .settings-card {
            border: 1px solid rgba(119, 197, 211, .16);
            border-radius: 12px;
            background: rgba(5, 35, 44, .78);
            overflow: hidden;
          }

          .settings-card-header {
            display: flex;
            align-items: center;
            gap: 13px;
            padding: 22px 24px;
            border-bottom: 1px solid rgba(119, 197, 211, .12);
          }

          .settings-card-icon {
            width: 38px;
            height: 38px;
            display: grid;
            place-items: center;
            border-radius: 8px;
            color: #36d8e8;
            background: rgba(23, 188, 207, .09);
            border: 1px solid rgba(54, 216, 232, .16);
          }

          .settings-card-header h2 {
            margin: 0;
            font-size: 15px;
            font-weight: 650;
          }

          .settings-card-header span {
            display: block;
            margin-top: 4px;
            color: #6f929b;
            font-size: 11px;
          }

          .settings-card-body {
            padding: 22px 24px;
          }

          .settings-row {
            min-height: 58px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            border-bottom: 1px solid rgba(119, 197, 211, .08);
          }

          .settings-row:last-child {
            border-bottom: 0;
          }

          .settings-row-info strong {
            display: block;
            color: #dceff2;
            font-size: 13px;
          }

          .settings-row-info span {
            display: block;
            margin-top: 4px;
            color: #6f929b;
            font-size: 11px;
          }

          .settings-select {
            min-width: 180px;
            height: 38px;
            padding: 0 12px;
            border: 1px solid rgba(119, 197, 211, .2);
            border-radius: 6px;
            outline: none;
            background: #062630;
            color: #dff8fc;
            font-size: 12px;
          }

          .settings-select:focus {
            border-color: #25d4e8;
          }

          .settings-toggle {
            position: relative;
            width: 44px;
            height: 24px;
            border: 0;
            border-radius: 20px;
            padding: 0;
            cursor: pointer;
            background: #29434b;
            transition: .2s ease;
          }

          .settings-toggle.active {
            background: #12bfd3;
          }

          .settings-toggle span {
            position: absolute;
            top: 4px;
            left: 4px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #dffcff;
            transition: .2s ease;
          }

          .settings-toggle.active span {
            left: 24px;
          }

          .settings-profile {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .settings-avatar {
            width: 46px;
            height: 46px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            color: #35d8e9;
            background: rgba(24, 188, 207, .1);
            border: 1px solid rgba(54, 216, 232, .2);
          }

          .settings-profile strong {
            display: block;
            font-size: 14px;
          }

          .settings-profile span {
            display: block;
            margin-top: 4px;
            color: #6f929b;
            font-size: 11px;
          }

          .settings-side {
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .system-status {
            padding: 22px;
          }

          .system-status-title {
            display: flex;
            align-items: center;
            gap: 9px;
            color: #35d8e9;
            font-size: 11px;
            font-weight: 750;
            letter-spacing: .12em;
          }

          .system-status h3 {
            margin: 15px 0 5px;
            font-size: 20px;
            font-weight: 550;
          }

          .system-status p {
            margin: 0;
            color: #70949d;
            font-size: 11px;
            line-height: 1.6;
          }

          .status-line {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 18px;
            color: #7bd8bf;
            font-size: 11px;
          }

          .status-line i {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #39e5ae;
            box-shadow: 0 0 10px rgba(57, 229, 174, .7);
          }

          .save-button {
            width: 100%;
            height: 45px;
            border: 0;
            border-radius: 7px;
            background: #12bfd3;
            color: #002831;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .1em;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            transition: .2s ease;
          }

          .save-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(0, 198, 222, .18);
          }

          .saved-message {
            display: flex;
            align-items: center;
            gap: 7px;
            margin-top: 10px;
            color: #71dfbd;
            font-size: 11px;
          }

          .security-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 13px 0;
            border-bottom: 1px solid rgba(119, 197, 211, .08);
          }

          .security-item:last-child {
            border-bottom: 0;
          }

          .security-item svg {
            color: #5eabb8;
          }

          .security-item span {
            color: #91b1b8;
            font-size: 11px;
          }

          @media (max-width: 900px) {
            .settings-page {
              padding: 24px 18px 40px;
            }

            .settings-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      {/* HEADER */}
      <header className="settings-header">
        <div className="settings-eyebrow">
          <SlidersHorizontal size={14} />
          SYSTEM CONFIGURATION
        </div>

        <h1>Settings</h1>

        <p>
          Configure POLARIS operational preferences and platform
          behavior.
        </p>
      </header>

      <div className="settings-grid">
        <div className="settings-main">

          {/* ACCOUNT */}
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon">
                <User size={18} />
              </div>

              <div>
                <h2>Operator account</h2>
                <span>Current authenticated operator</span>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="settings-profile">
                <div className="settings-avatar">
                  <User size={20} />
                </div>

                <div>
                  <strong>
                    {user?.name || "POLARIS Operator"}
                  </strong>

                  <span>
                    {user?.email || "admin@antarctic.com"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* STATION */}
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon">
                <Globe2 size={18} />
              </div>

              <div>
                <h2>Station preferences</h2>
                <span>
                  Select the station shown by default
                </span>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="settings-row">
                <div className="settings-row-info">
                  <strong>Default station</strong>
                  <span>
                    Used across station-aware operational views
                  </span>
                </div>

                <select
                  className="settings-select"
                  value={stationId}
                  onChange={(event) =>
                    setStationId(
                      event.target.value as
                        | "maitri"
                        | "bharati"
                    )
                  }
                >
                  <option value="bharati">
                    Bharati
                  </option>

                  <option value="maitri">
                    Maitri
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* PLATFORM */}
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon">
                <Monitor size={18} />
              </div>

              <div>
                <h2>Platform preferences</h2>
                <span>
                  Dashboard refresh and notification behavior
                </span>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="settings-row">
                <div className="settings-row-info">
                  <strong>Operational notifications</strong>
                  <span>
                    Show alerts and operational events
                  </span>
                </div>

                <button
                  type="button"
                  className={`settings-toggle ${
                    notifications ? "active" : ""
                  }`}
                  onClick={() =>
                    setNotifications((value) => !value)
                  }
                  aria-label="Toggle notifications"
                >
                  <span />
                </button>
              </div>

              <div className="settings-row">
                <div className="settings-row-info">
                  <strong>Automatic refresh</strong>
                  <span>
                    Refresh operational dashboard data
                  </span>
                </div>

                <button
                  type="button"
                  className={`settings-toggle ${
                    autoRefresh ? "active" : ""
                  }`}
                  onClick={() =>
                    setAutoRefresh((value) => !value)
                  }
                  aria-label="Toggle automatic refresh"
                >
                  <span />
                </button>
              </div>
            </div>
          </section>

          {/* SAVE */}
          <section>
            <button
              type="button"
              className="save-button"
              onClick={handleSave}
            >
              <Save size={16} />
              SAVE PREFERENCES
            </button>

            {saved && (
              <div className="saved-message">
                <CheckCircle2 size={15} />
                Settings saved successfully.
              </div>
            )}
          </section>
        </div>

        {/* RIGHT SIDE */}
        <aside className="settings-side">

          {/* SYSTEM */}
          <section className="settings-card system-status">
            <div className="system-status-title">
              <Server size={15} />
              SYSTEM STATUS
            </div>

            <h3>POLARIS Online</h3>

            <p>
              The Antarctic Digital Twin platform is operating
              normally.
            </p>

            <div className="status-line">
              <i />
              Platform operational
            </div>
          </section>

          {/* SECURITY */}
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h2>Security</h2>
                <span>Authentication status</span>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="security-item">
                <LockKeyhole size={16} />
                <span>JWT authentication enabled</span>
              </div>

              <div className="security-item">
                <Database size={16} />
                <span>Backend API connected</span>
              </div>

              <div className="security-item">
                <Bell size={16} />
                <span>
                  Operational alert system enabled
                </span>
              </div>
            </div>
          </section>

          {/* VERSION */}
          <section className="settings-card system-status">
            <div className="system-status-title">
              <Database size={15} />
              PLATFORM
            </div>

            <h3>POLARIS 1.0</h3>

            <p>
              Antarctic Digital Twin · SIH26060 prototype
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}