import { z } from 'zod';

const basePatientSchema = z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
    syntoms: z.array(z.string().min(5)).optional(),
    diagnostic: z.string().optional(),
    treatment: z.string().optional(),
    budget: z.array(z.number()),
    location: z.string(),
    languages: z.array(z.string()),
});

export const patientSchema = basePatientSchema.strict();
export const updatedPatientSchema = patientSchema.partial();