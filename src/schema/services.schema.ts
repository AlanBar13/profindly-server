import { z } from "zod";

const baseServicesSchema = z.object({
  specialist_id: z.string(),
  label: z.string(),
  thumbnail: z.string(),
  aviability: z.any(),
});

export const servicesSchema = baseServicesSchema.strict();
export const updatedServiceSchema = baseServicesSchema.partial();
