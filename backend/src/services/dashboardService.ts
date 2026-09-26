import prisma from "../config/prisma";

export const getDashboardStats = async () => {
  const [
    stationCount,
    infrastructureCount,
    sensorCount,
    activeSensorCount,
    activeAlerts,
    recentReadings,
  ] = await Promise.all([
    prisma.station.count(),

    prisma.infrastructure.count(),

    prisma.sensor.count(),

    prisma.sensor.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.alert.count({
      where: {
        status: {
          in: ["ACTIVE", "ACKNOWLEDGED"],
        },
      },
    }),

    prisma.sensorReading.findMany({
      take: 10,
      orderBy: {
        recordedAt: "desc",
      },
      include: {
        sensor: {
          include: {
            station: true,
          },
        },
      },
    }),
  ]);

  return {
    stations: stationCount,
    infrastructures: infrastructureCount,
    sensors: sensorCount,
    activeSensors: activeSensorCount,
    activeAlerts,
    recentReadings,
  };
};