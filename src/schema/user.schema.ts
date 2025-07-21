import { z } from 'zod';

const baseUserSchema = z.object({
    name: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    gender: z.string(),
    preferredLanguage: z.string().optional(),
    preferredLocation: z.string().optional(),
    notificationToken: z.string().optional(),
    loginType: z.string(),
    authId: z.string()
});

export const userSchema = baseUserSchema.strict();
export const updatedUserSchema = baseUserSchema.partial();