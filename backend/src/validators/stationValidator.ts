import { z } from "zod";

export const createStationSchema = z.object({
  name: z
    .string()
    .min(2, "Station name must be at least 2 characters")
    .max(100, "Station name cannot exceed 100 characters"),

  code: z
    .string()
    .min(2, "Station code must be at least 2 characters")
    .max(20, "Station code cannot exceed 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Station code can contain only uppercase letters, numbers, _ and -"
    ),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  type: z.enum(["RESEARCH", "SEASONAL", "PERMANENT"]),

  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  elevation: z
    .number()
    .optional(),

  active: z
    .boolean()
    .optional()
    .default(true),
});

export const updateStationSchema = createStationSchema.partial();

export type CreateStationInput = z.infer<typeof createStationSchema>;
export type UpdateStationInput = z.infer<typeof updateStationSchema>;