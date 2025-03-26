import { z } from "zod";

export const bookingsSchema = z.object({
  service: z.string(),
  client: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.string().optional(),
});

export const updatedBookingsSchema = z.object({
    status: z.string(),
    fromToken: z.string().optional()
})