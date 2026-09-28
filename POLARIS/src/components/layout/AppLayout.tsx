import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Sidebar.css";

export default function AppLayout() {
  return (
    <div className="polaris-layout">
      <Sidebar />

      <main className="polaris-workspace">
        <Outlet />
      </main>
    </div>
  );
}