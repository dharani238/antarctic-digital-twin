import prisma from "../config/prisma";


// ============================================================
// CHECK WHETHER A READING VIOLATES A THRESHOLD
// ============================================================

const isThresholdExceeded = (
  value: number,
  operator: string,
  threshold: number
): boolean => {
  switch (operator) {
    case "GREATER_THAN":
      return value > threshold;

    case "GREATER_THAN_OR_EQUAL":
      return value >= threshold;

    case "LESS_THAN":
      return value < threshold;

    case "LESS_THAN_OR_EQUAL":
      return value <= threshold;

    case "EQUAL":
      return value === threshold;

    default:
      return false;
  }
};


// ============================================================
// CHECK ALL THRESHOLDS FOR A READING
// ============================================================

export const checkThresholdsForReading = async (
  sensorId: string,
  value: number
) => {
  const thresholds =
    await prisma.sensorThreshold.findMany({
      where: {
        sensorId,
        enabled: true,
      },
    });

  const triggeredAlerts = [];

  for (const threshold of thresholds) {

    const exceeded = isThresholdExceeded(
      value,
      threshold.operator,
      threshold.value
    );

    if (!exceeded) {
      continue;
    }


    // --------------------------------------------------------
    // Prevent duplicate active alerts
    // --------------------------------------------------------

    const existingAlert =
      await prisma.alert.findFirst({
        where: {
          sensorId,
          thresholdId: threshold.id,
          status: {
            in: [
              "ACTIVE",
              "ACKNOWLEDGED",
            ],
          },
        },
      });

    if (existingAlert) {
      triggeredAlerts.push(existingAlert);
      continue;
    }


    // --------------------------------------------------------
    // Create new alert
    // --------------------------------------------------------

    const alert =
      await prisma.alert.create({
        data: {

          title: threshold.name,

          // FIXED MESSAGE
          message:
            `${threshold.name}: Sensor value ` +
            `${value} exceeded threshold ` +
            `${threshold.value}`,

          severity: threshold.severity,

          status: "ACTIVE",

          sensorId,

          thresholdId:
            threshold.id,

          value,

        },
      });

    triggeredAlerts.push(alert);
  }

  return triggeredAlerts;
};


// ============================================================
// GET ALL ALERTS
// ============================================================

export const getAllAlerts = async () => {

  return prisma.alert.findMany({
    include: {
      sensor: true,
      threshold: true,
    },

    orderBy: {
      triggeredAt: "desc",
    },
  });
};


// ============================================================
// GET ACTIVE ALERTS
// ============================================================

export const getActiveAlerts = async () => {

  return prisma.alert.findMany({
    where: {
      status: {
        in: [
          "ACTIVE",
          "ACKNOWLEDGED",
        ],
      },
    },

    include: {
      sensor: true,
      threshold: true,
    },

    orderBy: {
      triggeredAt: "desc",
    },
  });
};


// ============================================================
// GET ALERTS FOR STATION
// ============================================================

export const getAlertsByStation = async (
  stationId: string
) => {

  return prisma.alert.findMany({
    where: {
      sensor: {
        stationId,
      },
    },

    include: {
      sensor: true,
      threshold: true,
    },

    orderBy: {
      triggeredAt: "desc",
    },
  });
};


// ============================================================
// RESOLVE ALERT
// ============================================================

export const resolveAlert = async (
  id: string
) => {

  const alert =
    await prisma.alert.findUnique({
      where: {
        id,
      },
    });

  if (!alert) {
    throw new Error(
      "Alert not found"
    );
  }

  if (
    alert.status === "RESOLVED"
  ) {
    throw new Error(
      "Alert is already resolved"
    );
  }

  return prisma.alert.update({
    where: {
      id,
    },

    data: {
      status: "RESOLVED",
      resolvedAt: new Date(),
    },
  });
};


// ============================================================
// ACKNOWLEDGE ALERT
// ============================================================

export const acknowledgeAlert = async (
  id: string
) => {

  const alert =
    await prisma.alert.findUnique({
      where: {
        id,
      },
    });

  if (!alert) {
    throw new Error(
      "Alert not found"
    );
  }

  if (
    alert.status === "RESOLVED"
  ) {
    throw new Error(
      "Cannot acknowledge a resolved alert"
    );
  }

  return prisma.alert.update({
    where: {
      id,
    },

    data: {
      status: "ACKNOWLEDGED",
    },
  });
};