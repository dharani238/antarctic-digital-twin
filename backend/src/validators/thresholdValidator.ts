import { z } from "zod";

export const createThresholdSchema = z.object({
  name: z.string().min(2).max(100),

  description: z.string().max(500).optional(),

  sensorId: z.string().uuid(),

  operator: z.enum([
    "GREATER_THAN",
    "GREATER_THAN_OR_EQUAL",
    "LESS_THAN",
    "LESS_THAN_OR_EQUAL",
    "EQUAL",
  ]),

  value: z.number().finite(),

  severity: z
    .enum(["INFO", "WARNING", "CRITICAL"])
    .default("WARNING"),

  enabled: z.boolean().optional().default(true),
});

export const updateThresholdSchema =
  createThresholdSchema
    .omit({
      sensorId: true,
    })
    .partial();

export type CreateThresholdInput =
  z.infer<typeof createThresholdSchema>;

export type UpdateThresholdInput =
  z.infer<typeof updateThresholdSchema>;