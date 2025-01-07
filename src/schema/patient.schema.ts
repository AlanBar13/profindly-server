import { z } from 'zod';

export const patientSchema = z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
    syntoms: z.array(z.string().min(5)).optional(),
    diagnostic: z.string().optional(),
    treatment: z.string().optional(),
    budget: z.array(z.number()),
    location: z.string(),
    langauges: z.array(z.string()),
});