import dayjs from "dayjs";
import * as mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Services",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialist",
    required: true,
  },
  startTime: String,
  endTime: String,
  status: {
    type: String,
    enum: ["booked", "pending", "cancelled", "completed"],
    default: "pending",
  },
  bookDate: String,
  bookingStart: Date,
  bookingEnd: Date,
}, { timestamps: true });

bookingsSchema.pre("save", function (next) {
  const booking = this as Bookings;
  const date = dayjs(booking.bookDate);
  booking.bookingStart = date
    .set("hour", parseInt(booking.startTime!.split(":")[0]))
    .set("minute", parseInt(booking.startTime!.split(":")[1]))
    .toDate();
  booking.bookingEnd = date
    .set("hour", parseInt(booking.endTime!.split(":")[0]))
    .set("minute", parseInt(booking.endTime!.split(":")[1]))
    .toDate();
  next();
});

bookingsSchema.index({ user: 1, status: 1, date: 1 });

export type Bookings = mongoose.InferSchemaType<typeof bookingsSchema>;
export const BookingsModel = mongoose.model<Bookings>(
  "Bookings",
  bookingsSchema
);
