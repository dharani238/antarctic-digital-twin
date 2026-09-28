import prisma from "../config/prisma";

import {
  CreateInfrastructureInput,
  UpdateInfrastructureInput,
} from "../validators/infrastructureValidator";


// CREATE INFRASTRUCTURE
export const createInfrastructure = async (
  data: CreateInfrastructureInput
) => {
  // Check whether station exists
  const station = await prisma.station.findUnique({
    where: {
      id: data.stationId,
    },
  });

  if (!station) {
    throw new Error("Station not found");
  }

  return prisma.infrastructure.create({
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      status: data.status ?? "OPERATIONAL",
      stationId: data.stationId,
    },
  });
};


// GET ALL INFRASTRUCTURE FOR A STATION
export const getInfrastructureByStation = async (
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

  return prisma.infrastructure.findMany({
    where: {
      stationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


// GET INFRASTRUCTURE BY ID
export const getInfrastructureById = async (
  id: string
) => {
  return prisma.infrastructure.findUnique({
    where: {
      id,
    },
    include: {
      station: true,
    },
  });
};


// UPDATE INFRASTRUCTURE
export const updateInfrastructure = async (
  id: string,
  data: UpdateInfrastructureInput
) => {
  const infrastructure =
    await prisma.infrastructure.findUnique({
      where: {
        id,
      },
    });

  if (!infrastructure) {
    throw new Error("Infrastructure not found");
  }

  return prisma.infrastructure.update({
    where: {
      id,
    },
    data,
  });
};


// DELETE INFRASTRUCTURE
export const deleteInfrastructure = async (
  id: string
) => {
  const infrastructure =
    await prisma.infrastructure.findUnique({
      where: {
        id,
      },
    });

  if (!infrastructure) {
    throw new Error("Infrastructure not found");
  }

  return prisma.infrastructure.delete({
    where: {
      id,
    },
  });
};