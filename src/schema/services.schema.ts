import { z } from "zod";

const baseServicesSchema = z.object({
  label: z.string(),
  thumbnail: z.string(),
  location: z.string(),
  aviability: z.any(),
});

export const servicesSchema = baseServicesSchema.strict();
export const updatedServiceSchema = baseServicesSchema.partial();
