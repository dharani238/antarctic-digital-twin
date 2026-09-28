import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { StationId } from "../types";

interface StationContextValue {
  stationId: StationId;
  setStationId: (station: StationId) => void;
  isMaitri: boolean;
  isBharati: boolean;
}

const StationContext = createContext<StationContextValue | undefined>(
  undefined
);

export function StationProvider({ children }: { children: ReactNode }) {
  const [stationId, setStationId] = useState<StationId>("bharati");

  const value = useMemo<StationContextValue>(
    () => ({
      stationId,
      setStationId,
      isMaitri: stationId === "maitri",
      isBharati: stationId === "bharati",
    }),
    [stationId]
  );

  return (
    <StationContext.Provider value={value}>
      {children}
    </StationContext.Provider>
  );
}

export function useStation(): StationContextValue {
  const context = useContext(StationContext);

  if (context === undefined) {
    throw new Error("useStation must be used inside StationProvider");
  }

  return context;
}