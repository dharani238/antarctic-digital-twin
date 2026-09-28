import type { StationId, TelemetryPoint } from "../types";

const buildTelemetry = (
  _station: StationId,
  baseTemp: number,
  baseDemand: number
): TelemetryPoint[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, "0");

    const variation = Math.sin(i / 3);
    const powerVariation = Math.sin(i / 2.5);

    return {
      time: `${hour}:00`,
      temperature: Number((baseTemp + variation * 3.2).toFixed(1)),
      powerDemand: Math.round(baseDemand + powerVariation * 35),
      generation: Math.round(baseDemand + 45 + Math.sin(i / 4) * 25),
      fuelLevel: Number((82 - i * 0.12).toFixed(1)),
    };
  });
};

export const telemetry: Record<StationId, TelemetryPoint[]> = {
  maitri: buildTelemetry("maitri", -17.8, 310),
  bharati: buildTelemetry("bharati", -21.4, 355),
};