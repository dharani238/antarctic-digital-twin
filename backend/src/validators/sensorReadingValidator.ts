import { z } from "zod";

export const createSensorReadingSchema =
  z.object({
    value: z
      .number()
      .finite(),

    recordedAt: z
      .string()
      .datetime()
      .optional(),

    sensorId: z
      .string()
      .uuid("Invalid sensor ID"),
  });

export type CreateSensorReadingInput =
  z.infer<typeof createSensorReadingSchema>;