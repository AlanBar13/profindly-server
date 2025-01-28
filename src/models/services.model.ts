import * as mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialist",
    required: true,
  },
  label: { type: String, required: true },
  thumbnail: String,
  location: String,
  aviability: mongoose.Schema.Types.Mixed,
});

export type Services = mongoose.InferSchemaType<typeof servicesSchema>;
export const ServicesModel = mongoose.model<Services>(
  "Services",
  servicesSchema
);
