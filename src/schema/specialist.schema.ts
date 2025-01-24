import {z} from 'zod';

const baseSpecialistSchema = z.object({
    prefix: z.string(),
    brief_description: z.string(),
    links: z.array(z.string()),
    photo_link: z.string(),
    description: z.string(),
    budget_range: z.array(z.number()).min(2),
    schedule: z.string().optional(),
    location: z.string(),
    languages: z.array(z.string()),
    speciality: z.array(z.string()),
    subspecialities: z.array(z.string()).optional(),
    experience: z.number(),
    rating: z.number(),
    reviews: z.array(z.string()),
    specialist_id: z.array(z.string()),
    user: z.string(),
});

export const specialistSchema = baseSpecialistSchema.strict();
export const updatedSpecialistSchema = specialistSchema.partial();