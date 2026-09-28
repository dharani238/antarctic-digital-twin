import { z } from "zod";

export const createInfrastructureSchema = z.object({
  name: z
    .string()
    .min(2, "Infrastructure name must be at least 2 characters")
    .max(100, "Infrastructure name cannot exceed 100 characters"),

  type: z
    .string()
    .min(2, "Infrastructure type is required")
    .max(50, "Infrastructure type cannot exceed 50 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  status: z
    .string()
    .max(30, "Status cannot exceed 30 characters")
    .optional()
    .default("OPERATIONAL"),

  stationId: z
    .string()
    .uuid("Invalid station ID"),
});

export const updateInfrastructureSchema =
  createInfrastructureSchema
    .omit({
      stationId: true,
    })
    .partial();

export type CreateInfrastructureInput =
  z.infer<typeof createInfrastructureSchema>;

export type UpdateInfrastructureInput =
  z.infer<typeof updateInfrastructureSchema>;