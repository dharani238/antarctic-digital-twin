import type { Station, StationId } from "../types";

/*
 * POLARIS DATA POLICY
 *
 * Station identity, location and descriptive metadata:
 *   PUBLIC REFERENCE DATA — NCPOR / Government of India
 *
 * Operational values below:
 *   SIMULATED TELEMETRY — generated for SIH prototype demonstration.
 *
 * They must NOT be represented as live operational data from NCPOR.
 */

export const stations: Record<StationId, Station> = {
  maitri: {
    id: "maitri",

    name: "Maitri",
    code: "MTR",

    country: "India",
    region: "Schirmacher Oasis, Central Dronning Maud Land",

    coordinates: {
      latitude: -70.764,
      longitude: 11.732,
    },

    description:
      "India's year-round Antarctic research station located in the Schirmacher Oasis, Central Dronning Maud Land.",

    image: "/images/maitri-station.jpg",

    status: "nominal",

    environment: {
      temperature: -17.8,
      feelsLike: -25.6,
      windSpeed: 31,
      windDirection: "ESE",
      pressure: 982,
      humidity: 64,
      visibility: 8.4,
      condition: "Blowing snow",
    },

    energy: {
      demand: 312,
      generation: 367,
      generatorLoad: 68,
      renewableContribution: 11,
      fuelReserve: 82,
      estimatedFuelDays: 103,
    },

    infrastructure: {
      overallHealth: 93,
      hvac: "nominal",
      electrical: "nominal",
      water: "nominal",
      communications: "nominal",
      generators: "nominal",
    },

    communications: {
      status: "nominal",
      latency: 684,
      uplink: 18.7,
      downlink: 42.4,
    },

    logistics: {
      foodReserveDays: 124,
      fuelReserveDays: 103,
      medicalStock: 91,
      criticalSpares: 86,
    },
  },

  bharati: {
    id: "bharati",

    name: "Bharati",
    code: "BHR",

    country: "India",
    region: "Larsemann Hills, Prydz Bay, East Antarctica",

    coordinates: {
      latitude: -69.4068,
      longitude: 76.1953,
    },

    description:
      "India's year-round Antarctic research station in the Larsemann Hills region of East Antarctica.",

    image: "/images/bharati-station.jpg",

    status: "warning",

    environment: {
      temperature: -21.4,
      feelsLike: -31.8,
      windSpeed: 46,
      windDirection: "SE",
      pressure: 974,
      humidity: 71,
      visibility: 5.7,
      condition: "Drifting snow",
    },

    energy: {
      demand: 356,
      generation: 418,
      generatorLoad: 74,
      renewableContribution: 14,
      fuelReserve: 76,
      estimatedFuelDays: 84,
    },

    infrastructure: {
      overallHealth: 89,
      hvac: "nominal",
      electrical: "nominal",
      water: "nominal",
      communications: "nominal",
      generators: "warning",
    },

    communications: {
      status: "nominal",
      latency: 721,
      uplink: 16.9,
      downlink: 39.6,
    },

    logistics: {
      foodReserveDays: 137,
      fuelReserveDays: 84,
      medicalStock: 94,
      criticalSpares: 84,
    },
  },
};

export const stationList = Object.values(stations);