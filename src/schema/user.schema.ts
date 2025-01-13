import { z } from 'zod';

const baseUserSchema = z.object({
    name: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    login_type: z.string(),
    auth_id: z.string()
});

export const userSchema = baseUserSchema.strict();
export const updatedUserSchema = baseUserSchema.partial();