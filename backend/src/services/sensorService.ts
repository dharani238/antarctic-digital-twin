import prisma from "../config/prisma";

import {
  CreateSensorInput,
  UpdateSensorInput,
} from "../validators/sensorValidator";


// CREATE SENSOR
export const createSensor = async (
  data: CreateSensorInput
) => {
  const station = await prisma.station.findUnique({
    where: {
      id: data.stationId,
    },
  });

  if (!station) {
    throw new Error("Station not found");
  }

  const existingSensor = await prisma.sensor.findUnique({
    where: {
      code: data.code,
    },
  });

  if (existingSensor) {
    throw new Error("Sensor code already exists");
  }

  return prisma.sensor.create({
    data: {
      name: data.name,
      code: data.code,
      type: data.type,
      unit: data.unit,
      status: data.status ?? "ACTIVE",
      stationId: data.stationId,
    },
  });
};


// GET ALL SENSORS FOR STATION
export const getSensorsByStation = async (
  stationId: string
) => {
  const station = await prisma.station.findUnique({
    where: {
      id: stationId,
    },
  });

  if (!station) {
    throw new Error("Station not found");
  }

  return prisma.sensor.findMany({
    where: {
      stationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


// GET SENSOR BY ID
export const getSensorById = async (
  id: string
) => {
  return prisma.sensor.findUnique({
    where: {
      id,
    },
    include: {
      station: true,
    },
  });
};


// UPDATE SENSOR
export const updateSensor = async (
  id: string,
  data: UpdateSensorInput
) => {
  const sensor = await prisma.sensor.findUnique({
    where: {
      id,
    },
  });

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  return prisma.sensor.update({
    where: {
      id,
    },
    data,
  });
};


// DELETE SENSOR
export const deleteSensor = async (
  id: string
) => {
  const sensor = await prisma.sensor.findUnique({
    where: {
      id,
    },
  });

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  return prisma.sensor.delete({
    where: {
      id,
    },
  });
};