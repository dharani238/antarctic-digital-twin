import type { Scenario } from "../types";

export const scenarios: Scenario[] = [
  {
    id: "SCN-BLIZZARD",
    title: "Severe Blizzard",
    description:
      "Model the effect of extreme wind and falling temperature on heating demand, visibility and station operations.",
    category: "weather",
    severity: "extreme",
  },
  {
    id: "SCN-GENERATOR",
    title: "Primary Generator Failure",
    description:
      "Simulate loss of primary generation and evaluate backup capacity and critical-load prioritization.",
    category: "energy",
    severity: "severe",
  },
  {
    id: "SCN-FUEL",
    title: "Fuel Supply Constraint",
    description:
      "Evaluate station endurance when fuel availability falls below the planned operating reserve.",
    category: "energy",
    severity: "severe",
  },
  {
    id: "SCN-COMMS",
    title: "Satellite Link Degradation",
    description:
      "Simulate degraded remote communications and activate autonomous local operating procedures.",
    category: "communications",
    severity: "moderate",
  },
];