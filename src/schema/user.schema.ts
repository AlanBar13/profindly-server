import { z } from 'zod';

const baseUserSchema = z.object({
    name: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    gender: z.string(),
    preferred_language: z.string(),
    preferred_location: z.string(),
    login_type: z.string(),
    auth_id: z.string()
});

export const userSchema = baseUserSchema.strict();
export const updatedUserSchema = baseUserSchema.partial();