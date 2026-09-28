import prisma from "../config/prisma";

const getLatestReading = async (
  stationId: string,
  type:
    | "TEMPERATURE"
    | "HUMIDITY"
    | "PRESSURE"
    | "WIND_SPEED"
    | "WIND_DIRECTION"
    | "SOLAR_RADIATION"
    | "POWER"
    | "FUEL_LEVEL"
    | "WATER_LEVEL"
    | "AIR_QUALITY"
    | "OTHER"
) => {
  return prisma.sensorReading.findFirst({
    where: {
      sensor: {
        stationId,
        type,
      },
    },
    orderBy: {
      recordedAt: "desc",
    },
    include: {
      sensor: true,
    },
  });
};

export const getDashboardStats = async () => {
  /*
   * -------------------------------------------------------
   * GLOBAL COUNTS
   * -------------------------------------------------------
   */

  const [
    stationCount,
    infrastructureCount,
    sensorCount,
    activeSensorCount,
    activeAlerts,
  ] = await Promise.all([
    prisma.station.count({
      where: {
        active: true,
      },
    }),

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
  ]);

  /*
   * -------------------------------------------------------
   * STATIONS
   * -------------------------------------------------------
   */

  const stations = await prisma.station.findMany({
    where: {
      active: true,
    },

    orderBy: {
      name: "asc",
    },

    include: {
      infrastructures: true,

      sensors: {
        select: {
          id: true,
          name: true,
          code: true,
          type: true,
          unit: true,
          status: true,
        },
      },
    },
  });

  /*
   * -------------------------------------------------------
   * BUILD TELEMETRY FOR EACH STATION
   * -------------------------------------------------------
   */

  const stationTelemetry = await Promise.all(
    stations.map(async (station) => {
      const [
        temperature,
        humidity,
        pressure,
        windSpeed,
        power,
        fuelLevel,
        waterLevel,
      ] = await Promise.all([
        getLatestReading(station.id, "TEMPERATURE"),
        getLatestReading(station.id, "HUMIDITY"),
        getLatestReading(station.id, "PRESSURE"),
        getLatestReading(station.id, "WIND_SPEED"),
        getLatestReading(station.id, "POWER"),
        getLatestReading(station.id, "FUEL_LEVEL"),
        getLatestReading(station.id, "WATER_LEVEL"),
      ]);

      const totalSensors = station.sensors.length;

      const activeSensors = station.sensors.filter(
        (sensor) => sensor.status === "ACTIVE"
      ).length;

      const infrastructureTotal =
        station.infrastructures.length;

      const operationalInfrastructure =
        station.infrastructures.filter(
          (item) =>
            item.status.toUpperCase() === "OPERATIONAL"
        ).length;

      const infrastructureAvailability =
        infrastructureTotal === 0
          ? 0
          : Number(
              (
                (operationalInfrastructure /
                  infrastructureTotal) *
                100
              ).toFixed(1)
            );

      /*
       * Active alerts belonging to this station.
       */

      const alerts = await prisma.alert.findMany({
        where: {
          sensor: {
            stationId: station.id,
          },

          status: {
            in: ["ACTIVE", "ACKNOWLEDGED"],
          },
        },

        orderBy: {
          triggeredAt: "desc",
        },

        take: 10,

        include: {
          sensor: {
            select: {
              id: true,
              name: true,
              code: true,
              type: true,
              unit: true,
            },
          },
        },
      });

      return {
        id: station.id,
        name: station.name,
        code: station.code,
        description: station.description,
        type: station.type,

        location: {
          latitude: station.latitude,
          longitude: station.longitude,
          elevation: station.elevation,
        },

        active: station.active,

        statistics: {
          infrastructures: infrastructureTotal,
          operationalInfrastructure,
          infrastructureAvailability,

          sensors: totalSensors,
          activeSensors,

          sensorAvailability:
            totalSensors === 0
              ? 0
              : Number(
                  (
                    (activeSensors / totalSensors) *
                    100
                  ).toFixed(1)
                ),

          activeAlerts: alerts.length,
        },

        telemetry: {
          temperature: temperature
            ? {
                value: temperature.value,
                unit: temperature.sensor.unit,
                recordedAt: temperature.recordedAt,
              }
            : null,

          humidity: humidity
            ? {
                value: humidity.value,
                unit: humidity.sensor.unit,
                recordedAt: humidity.recordedAt,
              }
            : null,

          pressure: pressure
            ? {
                value: pressure.value,
                unit: pressure.sensor.unit,
                recordedAt: pressure.recordedAt,
              }
            : null,

          windSpeed: windSpeed
            ? {
                value: windSpeed.value,
                unit: windSpeed.sensor.unit,
                recordedAt: windSpeed.recordedAt,
              }
            : null,

          power: power
            ? {
                value: power.value,
                unit: power.sensor.unit,
                recordedAt: power.recordedAt,
              }
            : null,

          fuelLevel: fuelLevel
            ? {
                value: fuelLevel.value,
                unit: fuelLevel.sensor.unit,
                recordedAt: fuelLevel.recordedAt,
              }
            : null,

          waterLevel: waterLevel
            ? {
                value: waterLevel.value,
                unit: waterLevel.sensor.unit,
                recordedAt: waterLevel.recordedAt,
              }
            : null,
        },

        infrastructures: station.infrastructures.map(
          (item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            status: item.status,
          })
        ),

        alerts: alerts.map((alert) => ({
          id: alert.id,
          title: alert.title,
          message: alert.message,
          severity: alert.severity,
          status: alert.status,
          value: alert.value,
          triggeredAt: alert.triggeredAt,

          sensor: {
            id: alert.sensor.id,
            name: alert.sensor.name,
            code: alert.sensor.code,
            type: alert.sensor.type,
            unit: alert.sensor.unit,
          },
        })),
      };
    })
  );

  /*
   * -------------------------------------------------------
   * RECENT READINGS ACROSS ALL STATIONS
   * -------------------------------------------------------
   */

  const recentReadings =
    await prisma.sensorReading.findMany({
      take: 20,

      orderBy: {
        recordedAt: "desc",
      },

      include: {
        sensor: {
          include: {
            station: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

  /*
   * -------------------------------------------------------
   * FINAL DASHBOARD RESPONSE
   * -------------------------------------------------------
   */

  return {
    stations: stationCount,
    infrastructures: infrastructureCount,
    sensors: sensorCount,
    activeSensors: activeSensorCount,
    activeAlerts,

    stationTelemetry,

    recentReadings,
  };
};