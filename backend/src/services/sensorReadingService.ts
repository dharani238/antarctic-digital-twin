import prisma from "../config/prisma";
import { CreateSensorReadingInput } from "../validators/sensorReadingValidator";
import { checkThresholdsForReading } from "./alertService";

// ============================================================
// CREATE SINGLE SENSOR READING
// ============================================================

export const createSensorReading = async (
  data: CreateSensorReadingInput
) => {
  const sensor = await prisma.sensor.findUnique({
    where: {
      id: data.sensorId,
    },
  });

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  const reading = await prisma.sensorReading.create({
    data: {
      value: data.value,
      sensorId: data.sensorId,
      recordedAt: data.recordedAt
        ? new Date(data.recordedAt)
        : new Date(),
    },
  });

  const alerts = await checkThresholdsForReading(
    data.sensorId,
    data.value
  );

  return {
    reading,
    alerts,
  };
};


// ============================================================
// CREATE BULK SENSOR READINGS
// ============================================================

export const createSensorReadingsBulk = async (
  readings: CreateSensorReadingInput[]
) => {
  const results = [];

  for (const data of readings) {
    const sensor = await prisma.sensor.findUnique({
      where: {
        id: data.sensorId,
      },
    });

    if (!sensor) {
      throw new Error(
        `Sensor not found: ${data.sensorId}`
      );
    }

    const reading = await prisma.sensorReading.create({
      data: {
        value: data.value,
        sensorId: data.sensorId,
        recordedAt: data.recordedAt
          ? new Date(data.recordedAt)
          : new Date(),
      },
    });

    const alerts = await checkThresholdsForReading(
      data.sensorId,
      data.value
    );

    results.push({
      reading,
      alerts,
    });
  }

  return {
    count: results.length,
    data: results,
  };
};


// ============================================================
// GET SENSOR READINGS
// THIS IS THE FUNCTION THAT WAS CAUSING YOUR ERROR
// ============================================================

export const getSensorReadings = async (
  sensorId: string,
  from?: Date,
  to?: Date
) => {
  const sensor = await prisma.sensor.findUnique({
    where: {
      id: sensorId,
    },
  });

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  const where: {
    sensorId: string;
    recordedAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = {
    sensorId,
  };

  if (from || to) {
    where.recordedAt = {};

    if (from) {
      where.recordedAt.gte = from;
    }

    if (to) {
      where.recordedAt.lte = to;
    }
  }

  return prisma.sensorReading.findMany({
    where,
    orderBy: {
      recordedAt: "desc",
    },
  });
};


// ============================================================
// GET READINGS BY SENSOR
// ============================================================

export const getReadingsBySensor = async (
  sensorId: string
) => {
  const sensor = await prisma.sensor.findUnique({
    where: {
      id: sensorId,
    },
  });

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  return prisma.sensorReading.findMany({
    where: {
      sensorId,
    },
    orderBy: {
      recordedAt: "desc",
    },
  });
};


// ============================================================
// GET LATEST SENSOR READING
// ============================================================

export const getLatestSensorReading = async (
  sensorId: string
) => {
  const sensor = await prisma.sensor.findUnique({
    where: {
      id: sensorId,
    },
  });

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  return prisma.sensorReading.findFirst({
    where: {
      sensorId,
    },
    orderBy: {
      recordedAt: "desc",
    },
  });
};


// ============================================================
// GET RECENT READINGS
// ============================================================

export const getRecentReadings = async (
  sensorId: string,
  limit: number = 20
) => {
  const sensor = await prisma.sensor.findUnique({
    where: {
      id: sensorId,
    },
  });

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  return prisma.sensorReading.findMany({
    where: {
      sensorId,
    },
    orderBy: {
      recordedAt: "desc",
    },
    take: limit,
  });
};


// ============================================================
// GET READINGS BY DATE RANGE
// ============================================================

export const getReadingsByDateRange = async (
  sensorId: string,
  from: Date,
  to: Date
) => {
  const sensor = await prisma.sensor.findUnique({
    where: {
      id: sensorId,
    },
  });

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  return prisma.sensorReading.findMany({
    where: {
      sensorId,
      recordedAt: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      recordedAt: "asc",
    },
  });
};