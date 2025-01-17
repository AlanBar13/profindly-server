import { z } from "zod";

export const bookingsSchema = z.object({
  service_id: z.string(),
  client_id: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.string().optional(),
});

export const updatedBookingsSchema = z.object({
    status: z.string()
})