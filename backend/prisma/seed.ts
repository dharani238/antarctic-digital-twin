import prisma from "../src/config/prisma";

async function main() {
  console.log("🌱 Starting POLARIS database seed...");

  // Clean operational demo data so seed can be run repeatedly.
  await prisma.alert.deleteMany();
  await prisma.sensorThreshold.deleteMany();
  await prisma.sensorReading.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.infrastructure.deleteMany();
  await prisma.station.deleteMany();

  // =====================================================
  // STATIONS
  // =====================================================

  const bharati = await prisma.station.create({
    data: {
      name: "Bharati",
      code: "BHR-01",
      description: "Indian Antarctic research station at Larsemann Hills.",
      type: "PERMANENT",
      latitude: -69.407,
      longitude: 76.187,
      elevation: 35,
      active: true,
    },
  });

  const maitri = await prisma.station.create({
    data: {
      name: "Maitri",
      code: "MTR-01",
      description: "Indian Antarctic research station in Schirmacher Oasis.",
      type: "PERMANENT",
      latitude: -70.7667,
      longitude: 11.7333,
      elevation: 117,
      active: true,
    },
  });

  console.log("✅ Stations created");

  // =====================================================
  // INFRASTRUCTURE
  // =====================================================

  const bharatiInfrastructure = [
    ["Main Research Block", "RESEARCH", "OPERATIONAL"],
    ["Power Generation Unit", "POWER", "OPERATIONAL"],
    ["Fuel Storage Facility", "FUEL", "OPERATIONAL"],
    ["Communication Array", "COMMUNICATION", "OPERATIONAL"],
    ["Water Treatment System", "WATER", "OPERATIONAL"],
    ["Living Quarters", "HABITATION", "OPERATIONAL"],
  ];

  const maitriInfrastructure = [
    ["Research Laboratory", "RESEARCH", "OPERATIONAL"],
    ["Power Generation Unit", "POWER", "OPERATIONAL"],
    ["Fuel Storage Facility", "FUEL", "OPERATIONAL"],
    ["Satellite Communication System", "COMMUNICATION", "OPERATIONAL"],
    ["Water Management System", "WATER", "MAINTENANCE"],
    ["Living Quarters", "HABITATION", "OPERATIONAL"],
  ];

  for (const [name, type, status] of bharatiInfrastructure) {
    await prisma.infrastructure.create({
      data: {
        name,
        type,
        status,
        stationId: bharati.id,
      },
    });
  }

  for (const [name, type, status] of maitriInfrastructure) {
    await prisma.infrastructure.create({
      data: {
        name,
        type,
        status,
        stationId: maitri.id,
      },
    });
  }

  console.log("✅ Infrastructure created");

  // =====================================================
  // SENSOR CREATION HELPER
  // =====================================================

  async function createSensor(
    stationId: string,
    stationCode: string,
    name: string,
    code: string,
    type:
      | "TEMPERATURE"
      | "HUMIDITY"
      | "PRESSURE"
      | "WIND_SPEED"
      | "POWER"
      | "FUEL_LEVEL"
      | "WATER_LEVEL",
    unit: string,
    currentValue: number
  ) {
    const sensor = await prisma.sensor.create({
      data: {
        name,
        code: `${stationCode}-${code}`,
        type,
        unit,
        status: "ACTIVE",
        stationId,
      },
    });

    // Generate 24 hours of synthetic historical telemetry.
    for (let hour = 23; hour >= 0; hour--) {
      const recordedAt = new Date(
        Date.now() - hour * 60 * 60 * 1000
      );

      // Small deterministic variation for demo charts.
      const variation =
        Math.sin(hour * 0.7) *
        Math.max(Math.abs(currentValue) * 0.025, 0.5);

      await prisma.sensorReading.create({
        data: {
          sensorId: sensor.id,
          value: Number(
            (currentValue + variation).toFixed(2)
          ),
          recordedAt,
        },
      });
    }

    // Ensure the newest reading is exactly the dashboard value.
    await prisma.sensorReading.create({
      data: {
        sensorId: sensor.id,
        value: currentValue,
        recordedAt: new Date(),
      },
    });

    return sensor;
  }

  // =====================================================
  // BHARATI SENSORS
  // =====================================================

  const bharatiTemperature = await createSensor(
    bharati.id,
    "BHR",
    "External Temperature",
    "TEMP-01",
    "TEMPERATURE",
    "°C",
    -21.4
  );

  await createSensor(
    bharati.id,
    "BHR",
    "Relative Humidity",
    "HUM-01",
    "HUMIDITY",
    "%",
    61
  );

  await createSensor(
    bharati.id,
    "BHR",
    "Atmospheric Pressure",
    "PRES-01",
    "PRESSURE",
    "hPa",
    968
  );

  const bharatiWind = await createSensor(
    bharati.id,
    "BHR",
    "Wind Speed",
    "WIND-01",
    "WIND_SPEED",
    "km/h",
    46
  );

  await createSensor(
    bharati.id,
    "BHR",
    "Station Power Demand",
    "POWER-01",
    "POWER",
    "kW",
    356
  );

  await createSensor(
    bharati.id,
    "BHR",
    "Fuel Reserve",
    "FUEL-01",
    "FUEL_LEVEL",
    "%",
    83
  );

  await createSensor(
    bharati.id,
    "BHR",
    "Water Reserve",
    "WATER-01",
    "WATER_LEVEL",
    "%",
    91
  );

  // =====================================================
  // MAITRI SENSORS
  // =====================================================

  const maitriTemperature = await createSensor(
    maitri.id,
    "MTR",
    "External Temperature",
    "TEMP-01",
    "TEMPERATURE",
    "°C",
    -18.7
  );

  await createSensor(
    maitri.id,
    "MTR",
    "Relative Humidity",
    "HUM-01",
    "HUMIDITY",
    "%",
    67
  );

  await createSensor(
    maitri.id,
    "MTR",
    "Atmospheric Pressure",
    "PRES-01",
    "PRESSURE",
    "hPa",
    974
  );

  await createSensor(
    maitri.id,
    "MTR",
    "Wind Speed",
    "WIND-01",
    "WIND_SPEED",
    "km/h",
    32
  );

  await createSensor(
    maitri.id,
    "MTR",
    "Station Power Demand",
    "POWER-01",
    "POWER",
    "kW",
    294
  );

  await createSensor(
    maitri.id,
    "MTR",
    "Fuel Reserve",
    "FUEL-01",
    "FUEL_LEVEL",
    "%",
    76
  );

  await createSensor(
    maitri.id,
    "MTR",
    "Water Reserve",
    "WATER-01",
    "WATER_LEVEL",
    "%",
    88
  );

  console.log("✅ Sensors and telemetry created");

  // =====================================================
  // THRESHOLDS
  // =====================================================

  const bharatiTempThreshold =
    await prisma.sensorThreshold.create({
      data: {
        name: "Extreme low temperature",
        description:
          "Prototype threshold for unusually low external temperature.",
        sensorId: bharatiTemperature.id,
        operator: "LESS_THAN",
        value: -35,
        severity: "WARNING",
        enabled: true,
      },
    });

  const bharatiWindThreshold =
    await prisma.sensorThreshold.create({
      data: {
        name: "High wind speed",
        description:
          "Prototype threshold for elevated wind conditions.",
        sensorId: bharatiWind.id,
        operator: "GREATER_THAN",
        value: 80,
        severity: "WARNING",
        enabled: true,
      },
    });

  await prisma.sensorThreshold.create({
    data: {
      name: "Maitri extreme low temperature",
      sensorId: maitriTemperature.id,
      operator: "LESS_THAN",
      value: -35,
      severity: "WARNING",
      enabled: true,
    },
  });

  console.log("✅ Thresholds created");

  // =====================================================
  // DEMO ALERT
  // =====================================================

  await prisma.alert.create({
    data: {
      title: "Wind conditions require monitoring",
      message:
        "Prototype operational alert generated for POLARIS demonstration.",
      severity: "WARNING",
      status: "ACKNOWLEDGED",

      sensorId: bharatiWind.id,
      thresholdId: bharatiWindThreshold.id,

      value: 46,

      triggeredAt: new Date(
        Date.now() - 35 * 60 * 1000
      ),
    },
  });

  console.log("✅ Prototype alert created");

  console.log("");
  console.log("🧊 POLARIS database seeded successfully.");
  console.log("   Bharati: 7 sensors");
  console.log("   Maitri: 7 sensors");
  console.log("   Historical telemetry: generated");
  console.log(
    "   NOTE: Operational values are synthetic prototype data."
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });