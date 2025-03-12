import { z } from "zod";

const baseNotificationsSchema = z.object({
    token: z.string(),
    title: z.string(),
    body: z.string(),
    user_id: z.string(),
    type: z.string().optional()
})

export const notificationsSchema = baseNotificationsSchema.strict();
export const updatedNotificationsSchema = baseNotificationsSchema.partial();