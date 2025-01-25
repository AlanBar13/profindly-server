import * as mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema({
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  startTime: String,
  endTime: String,
  status: { type: String, enum: ["booked", "pending", "cancelled", "completed"], default: "booked"},
  bookDate: String,
});

export type Bookings = mongoose.InferSchemaType<typeof bookingsSchema>;
export const BookingsModel = mongoose.model<Bookings>(
  "Bookings",
  bookingsSchema
);
