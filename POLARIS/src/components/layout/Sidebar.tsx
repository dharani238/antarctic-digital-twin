import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  BrainCircuit,
  ChevronRight,
  FlaskConical,
  Gauge,
  LogOut,
  Settings,
  Snowflake,
  Truck,
  Zap,
} from "lucide-react";

import "./Sidebar.css";

const navigation = [
  { name: "Command Center", path: "/command", icon: Activity },
  { name: "Digital Twin", path: "/twin", icon: Boxes },
  { name: "Infrastructure", path: "/infrastructure", icon: Gauge },
  { name: "Energy", path: "/energy", icon: Zap },
  { name: "Environment", path: "/environment", icon: Snowflake },
  { name: "Logistics", path: "/logistics", icon: Truck },
  { name: "AI Predictions", path: "/predictions", icon: BrainCircuit },
  { name: "Scenario Lab", path: "/scenario-lab", icon: FlaskConical },
  { name: "Alerts", path: "/alerts", icon: AlertTriangle },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication information
    localStorage.removeItem("polaris_token");
    localStorage.removeItem("polaris_user");

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <aside className="polarisSidebar">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="polarisBrand">
        <div className="polarisBrandMark">
          <Snowflake size={20} strokeWidth={1.8} />
        </div>

        <div className="polarisBrandText">
          <strong>POLARIS</strong>
          <span>ANTARCTIC DIGITAL TWIN</span>
        </div>
      </div>

      <div className="polarisDivider" />

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div className="polarisNavLabel">
        OPERATIONS
      </div>

      <nav className="polarisNavigation">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "polarisNavItem polarisNavItemActive"
                  : "polarisNavItem"
              }
            >
              <Icon
                className="polarisNavIcon"
                size={18}
                strokeWidth={1.7}
              />

              <span>{item.name}</span>

              <ChevronRight
                className="polarisNavArrow"
                size={13}
                strokeWidth={1.7}
              />
            </NavLink>
          );
        })}
      </nav>

      {/* =====================================================
          SIDEBAR BOTTOM
      ===================================================== */}

      <div className="polarisSidebarBottom">

        {/* SETTINGS */}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive
              ? "polarisSettings polarisSettingsActive"
              : "polarisSettings"
          }
        >
          <Settings
            size={17}
            strokeWidth={1.7}
          />

          <span>Settings</span>

          <ChevronRight
            size={13}
          />
        </NavLink>

        {/* LOGOUT */}

        <button
          type="button"
          className="polarisLogout"
          onClick={handleLogout}
        >
          <LogOut
            size={17}
            strokeWidth={1.7}
          />

          <span>Logout</span>
        </button>

        {/* FOOTER */}

        <div className="polarisFooter">
          <strong>POLARIS</strong>
          <span>Operations Platform</span>
          <small>Version 1.0</small>
        </div>

      </div>

    </aside>
  );
}