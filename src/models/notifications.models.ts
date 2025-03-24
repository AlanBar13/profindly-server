import * as mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["info", "message", "alert"],
      default: "info",
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookings",
    },
  },
  { timestamps: true }
);

export type Notifications = mongoose.InferSchemaType<
  typeof notificationsSchema
>;
export const NotificationsModel = mongoose.model<Notifications>(
  "Notifications",
  notificationsSchema
);
