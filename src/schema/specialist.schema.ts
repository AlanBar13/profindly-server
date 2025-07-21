import { z } from "zod";

const baseSpecialistSchema = z.object({
  prefix: z.string(),
  briefDescription: z.string(),
  links: z.array(z.string()).optional(),
  photoLink: z.string(),
  description: z.string(),
  budgetRange: z.array(z.number()).min(2),
  schedule: z.string().optional(),
  location: z.string(),
  languages: z.array(z.string()).optional(),
  speciality: z.array(z.string()),
  subspecialities: z.array(z.string()).optional(),
  experience: z.number(),
  specialistId: z.array(z.string()),
  category: z.string().optional(),
  user: z.string().optional(),
  service: z.string().optional(),
});

export const specialistSchema = baseSpecialistSchema.strict();
export const updatedSpecialistSchema = specialistSchema.partial();
