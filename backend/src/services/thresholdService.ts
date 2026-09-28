import prisma from "../config/prisma";

import {
  CreateThresholdInput,
  UpdateThresholdInput,
} from "../validators/thresholdValidator";


// CREATE THRESHOLD
export const createThreshold = async (
  data: CreateThresholdInput
) => {
  const sensor = await prisma.sensor.findUnique({
    where: {
      id: data.sensorId,
    },
  });

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  return prisma.sensorThreshold.create({
    data: {
      name: data.name,
      description: data.description,
      sensorId: data.sensorId,
      operator: data.operator,
      value: data.value,
      severity: data.severity,
      enabled: data.enabled,
    },
  });
};


// GET ALL THRESHOLDS
export const getThresholds = async () => {
  return prisma.sensorThreshold.findMany({
    include: {
      sensor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


// GET THRESHOLDS FOR SENSOR
export const getThresholdsBySensor = async (
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

  return prisma.sensorThreshold.findMany({
    where: {
      sensorId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


// GET THRESHOLD BY ID
export const getThresholdById = async (
  id: string
) => {
  return prisma.sensorThreshold.findUnique({
    where: {
      id,
    },
    include: {
      sensor: true,
    },
  });
};


// UPDATE THRESHOLD
export const updateThreshold = async (
  id: string,
  data: UpdateThresholdInput
) => {
  const threshold =
    await prisma.sensorThreshold.findUnique({
      where: {
        id,
      },
    });

  if (!threshold) {
    throw new Error("Threshold not found");
  }

  return prisma.sensorThreshold.update({
    where: {
      id,
    },
    data,
  });
};


// DELETE THRESHOLD
export const deleteThreshold = async (
  id: string
) => {
  const threshold =
    await prisma.sensorThreshold.findUnique({
      where: {
        id,
      },
    });

  if (!threshold) {
    throw new Error("Threshold not found");
  }

  return prisma.sensorThreshold.delete({
    where: {
      id,
    },
  });
};