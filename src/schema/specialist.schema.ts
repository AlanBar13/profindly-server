import {z} from 'zod';

const baseSpecialistSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    budget_range: z.array(z.number()).min(2),
    schedule: z.string().optional(),
    location: z.string(),
    languages: z.array(z.string()),
    speciality: z.array(z.string()),
    subspecialities: z.array(z.string()).optional(),
    experience: z.number(),
    specialist_id: z.array(z.string()),
});

export const specialistSchema = baseSpecialistSchema.strict();
export const updatedSpecialistSchema = specialistSchema.partial();