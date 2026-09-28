import { z } from "zod";

export const createSensorSchema = z.object({
  name: z
    .string()
    .min(2, "Sensor name must be at least 2 characters")
    .max(100),

  code: z
    .string()
    .min(2, "Sensor code is required")
    .max(50)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Sensor code can contain only letters, numbers, _ and -"
    ),

  type: z.enum([
    "TEMPERATURE",
    "HUMIDITY",
    "PRESSURE",
    "WIND_SPEED",
    "WIND_DIRECTION",
    "SOLAR_RADIATION",
    "POWER",
    "FUEL_LEVEL",
    "WATER_LEVEL",
    "AIR_QUALITY",
    "OTHER",
  ]),

  unit: z
    .string()
    .min(1, "Unit is required")
    .max(20),

  status: z
    .enum([
      "ACTIVE",
      "INACTIVE",
      "MAINTENANCE",
      "FAULT",
    ])
    .optional(),

  stationId: z
    .string()
    .uuid("Invalid station ID"),
});

export const updateSensorSchema =
  createSensorSchema
    .omit({
      stationId: true,
      code: true,
    })
    .partial();

export type CreateSensorInput =
  z.infer<typeof createSensorSchema>;

export type UpdateSensorInput =
  z.infer<typeof updateSensorSchema>;