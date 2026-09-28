import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { StationProvider } from "./context/StationContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CommandCenter from "./pages/CommandCenter";
import DigitalTwin from "./pages/DigitalTwin";
import Infrastructure from "./pages/Infrastructure";
import Energy from "./pages/Energy";
import Environment from "./pages/Environment";
import Logistics from "./pages/Logistics";
import Predictions from "./pages/Predictions";
import ScenarioLab from "./pages/ScenarioLab";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <StationProvider>
        <Routes>
          {/* PUBLIC */}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* PROTECTED */}

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/command" element={<CommandCenter />} />
              <Route path="/twin" element={<DigitalTwin />} />

              <Route
                path="/infrastructure"
                element={<Infrastructure />}
              />

              <Route path="/energy" element={<Energy />} />

              <Route
                path="/environment"
                element={<Environment />}
              />

              <Route
                path="/logistics"
                element={<Logistics />}
              />

              <Route
                path="/predictions"
                element={<Predictions />}
              />

              <Route
                path="/scenario-lab"
                element={<ScenarioLab />}
              />

              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </StationProvider>
    </BrowserRouter>
  );
}

export default App;