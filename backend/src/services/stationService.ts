import prisma from "../config/prisma";
import {
  CreateStationInput,
  UpdateStationInput,
} from "../validators/stationValidator";

export const createStation = async (
  data: CreateStationInput
) => {
  const existingStation = await prisma.station.findUnique({
    where: {
      code: data.code,
    },
  });

  if (existingStation) {
    throw new Error("A station with this code already exists");
  }

  return prisma.station.create({
    data: {
      name: data.name,
      code: data.code,
      description: data.description,
      type: data.type,
      latitude: data.latitude,
      longitude: data.longitude,
      elevation: data.elevation,
      active: data.active ?? true,
    },
  });
};

export const getAllStations = async () => {
  return prisma.station.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      infrastructures: true,
      sensors: true,
    },
  });
};

export const getStationById = async (
  id: string
) => {
  return prisma.station.findUnique({
    where: {
      id,
    },
    include: {
      infrastructures: true,
      sensors: {
        include: {
          readings: {
            orderBy: {
              recordedAt: "desc",
            },
            take: 10,
          },
        },
      },
    },
  });
};

export const updateStation = async (
  id: string,
  data: UpdateStationInput
) => {
  const station = await prisma.station.findUnique({
    where: {
      id,
    },
  });

  if (!station) {
    throw new Error("Station not found");
  }

  if (data.code && data.code !== station.code) {
    const existingStation = await prisma.station.findUnique({
      where: {
        code: data.code,
      },
    });

    if (existingStation) {
      throw new Error(
        "A station with this code already exists"
      );
    }
  }

  return prisma.station.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteStation = async (
  id: string
) => {
  const station = await prisma.station.findUnique({
    where: {
      id,
    },
  });

  if (!station) {
    throw new Error("Station not found");
  }

  return prisma.station.delete({
    where: {
      id,
    },
  });
};